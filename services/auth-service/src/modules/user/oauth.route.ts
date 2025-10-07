import { FastifyInstance } from "fastify";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";

export async function oauthRoutes(app: FastifyInstance) {
  // Redirect user to GitHub OAuth
  app.get("/github", async (_req, reply) => {
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
    reply.redirect(redirectUrl);
  });

  // Handle trailing slash
  app.get("/github/", async (_req, reply) => {
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
    reply.redirect(redirectUrl);
  });

  // GitHub redirects here with ?code=

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
      console.error("GitHub token exchange failed:", text);
      return reply.status(500).send({ error: "GitHub token exchange failed" });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Fetch user info
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const user = await userRes.json();

    // Generate JWT
    const jwtToken = jwt.sign(
      { id: user.id, username: user.login },
      "supersecretcode-CHANGE_THIS-USE_ENV_FILE",
      { expiresIn: "1h" },
    );

    reply.redirect(`http://localhost/login?token=${jwtToken}`);
  });
}
