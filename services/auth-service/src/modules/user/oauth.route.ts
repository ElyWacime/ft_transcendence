import { FastifyInstance } from "fastify";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import prisma from "../../utils/prisma";

export async function oauthRoutes(app: FastifyInstance) {
  app.get("/github", async (_req, reply) => {
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
    reply.redirect(redirectUrl);
  });

  app.get("/github/", async (_req, reply) => {
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
    reply.redirect(redirectUrl);
  });

  app.get("/github/callback", async (req, reply) => {
    const code = (req.query as any).code;

    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          client_id: process.env.GITHUB_CLIENT_ID!,
          client_secret: process.env.GITHUB_CLIENT_SECRET!,
          code,
        }),
      },
    );

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      return reply.status(500).send({ error: "GitHub token exchange failed" });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const user = await userRes.json();

    let email = user.email;
    if (!email) {
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const emails = await emailsRes.json();
      const primary = emails.find((e: any) => e.primary && e.verified);
      email = primary?.email || emails[0]?.email || "";
    }

    if (!email) {
      return reply
        .status(400)
        .send({ error: "Email not found in GitHub account" });
    }

    const dbUser = await prisma.user.upsert({
      where: { email },
      update: {
        loggedIn: true,
        name: user.login || user.name,
      },
      create: {
        email,
        name: user.login || user.name,
        password: "",
        loggedIn: true,
      },
    });

    const jwtToken = jwt.sign(
      { id: dbUser.id, username: dbUser.name, email: dbUser.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "10h" },
    );

    const redirectUrl = new URL(`https://${process.env.DOMAIN}/login`);
    redirectUrl.searchParams.set("token", jwtToken);
    redirectUrl.searchParams.set("email", email);
    reply.redirect(redirectUrl.toString());

  });
}
