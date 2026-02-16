import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { userRoutes } from "./modules/user/user.route";
import fjwt, { FastifyJWT } from "@fastify/jwt";
import fCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { oauthRoutes } from "./modules/user/oauth.route";

const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.register(cors, {
  origin: [
    `https://${process.env.DOMAIN}`,
    `https://${process.env.DOMAIN}:8080`,
    "https://127.0.0.1:8080",
    "https://frontend:8080",
    "https://0.0.0.0",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

app.register(fjwt, { secret: process.env.JWT_ACCESS_SECRET });
app.addHook("preHandler", (req, _res, next) => {
  req.jwt = app.jwt;
  next();
});

app.register(fCookie, {
  secret: process.env.COOKIE_SECRET,
  hook: "preHandler",
});

app.decorate(
  "authenticate",
  async (req: FastifyRequest, reply: FastifyReply) => {
    let token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      token = req.cookies.access_token;
    }
    
    if (!token) {
      return reply.status(401).send({ message: "Authentication required" });
    }

    try {
      const decoded = req.jwt.verify<FastifyJWT["user"]>(token);
      req.user = decoded;
    } catch (err) {
      return reply.status(401).send({ message: "Invalid token" });
    }
  },
);

app.get("/healthcheck", async () => ({ message: "Success" }));

app.register(oauthRoutes, { prefix: "/auth" });

app.register(userRoutes);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    app.log.info(`Received ${signal}, closing Fastify...`);
    await app.close();
    process.exit(0);
  });
}

async function main() {
  try {
    await app.listen({ port: 8000, host: "0.0.0.0" });
    app.log.info("✅ Auth service running on port 8000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
