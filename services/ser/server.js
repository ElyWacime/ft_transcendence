import Fastify from "fastify";
import websocket from "@fastify/websocket";

const fastify = Fastify({ logger: true });

await fastify.register(websocket);

// Only 2 parameters: connection = WebSocket, req = Fastify request
fastify.get("/ws", { websocket: true }, (connection, req) => {
  console.log("Client connected");

  connection.on("message", (msg) => {
    console.log("Received:", msg.toString());
  });

  const interval = setInterval(() => {
    connection.send("Hello from Fastify WebSocket server");
  }, 2000);

  connection.on("close", () => {
    clearInterval(interval);
    console.log("Client disconnected");
  });
});

fastify.listen({ port: 3000, host: "0.0.0.0" });
