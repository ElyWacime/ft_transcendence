import Fastify from "fastify";
import { userRoutes } from "./modules/user/user.route";

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
main();
