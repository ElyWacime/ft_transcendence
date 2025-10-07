import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { userRoutes } from "./modules/user/user.route";
import fjwt, { FastifyJWT } from "@fastify/jwt";
import fCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { oauthRoutes } from "./modules/user/oauth.route";

const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

// --- CORS ---
app.register(cors, {
  origin: [
    "http://localhost",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://frontend:8080",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

// --- JWT ---
app.register(fjwt, { secret: "supersecretcode-CHANGE_THIS-USE_ENV_FILE" });
app.addHook("preHandler", (req, _res, next) => {
  req.jwt = app.jwt;
  next();
});

// --- Cookies ---
app.register(fCookie, {
  secret: "some-secret-key",
  hook: "preHandler",
});

// --- Auth decorator ---
app.decorate(
  "authenticate",
  async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.cookies.access_token;
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

// --- Healthcheck ---
app.get("/healthcheck", async () => ({ message: "Success" }));

// --- Routes ---
//  No prefix here — NGINX handles `/api/users/`
app.register(userRoutes);

// --- OAuth routes ---
app.register(oauthRoutes);

// --- Graceful shutdown ---
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    app.log.info(`Received ${signal}, closing Fastify...`);
    await app.close();
    process.exit(0);
  });
}

// --- Start server ---
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
