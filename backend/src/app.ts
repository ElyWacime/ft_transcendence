import Fastify from "fastify";
import { userRoutes } from "./modules/user/user.route";
import fjwt, { FastifyJWT } from "@fastify/jwt";
import fCookie from "@fastify/cookie";

const app = Fastify({ logger: true });
async function main() {
  await app.listen({
    port: 8000,
    host: "0.0.0.0",
  });
}

app.get("/healthcheck", (req, res) => {
  res.send({ message: "Success" });
});

// graceful shutdown
const listeners = ["SIGINT", "SIGTERM"];
listeners.forEach((signal) => {
  process.on(signal, async () => {
    await app.close();
    process.exit(0);
  });
});

app.register(userRoutes, { prefix: "/api/users" });

// jwt
app.register(fjwt, { secret: "supersecretcode-CHANGE_THIS-USE_ENV_FILE" });
app.addHook("preHandler", (req, res, next) => {
  // here we are
  req.jwt = app.jwt;
  return next();
});
// cookies
app.register(fCookie, {
  secret: "some-secret-key",
  hook: "preHandler",
});

main();
