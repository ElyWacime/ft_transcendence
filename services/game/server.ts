import Fastify from "fastify";
import registerWebsocket from "./websocket";

const fastify = Fastify({ logger: true });

async function build() {
  // Register health route
  fastify.get("/", async () => {
    return { ok: true, message: "Fastify Pong server is running" };
  });

  // Register websocket & game logic
  await registerWebsocket(fastify);

  const port = Number(process.env.PORT || 3000);
  await fastify.listen({ port, host: "0.0.0.0" });
  fastify.log.info(`Server listening on http://0.0.0.0:${port}`);
}

build().catch(err => {
  fastify.log.error(err);
  process.exit(1);
});
