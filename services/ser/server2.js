import Fastify from "fastify";
import websocket from "@fastify/websocket";

const fastify = Fastify({ logger: true });

await fastify.register(websocket);

// Keep track of all connected clients
const clients = new Set();

fastify.get("/ws", { websocket: true }, (connection, req) => {
  clients.add(connection);
  console.log("Client connected. Total clients:", clients.size);

  // Handle incoming messages from this client
  connection.on("message", (msg) => {
    console.log("Received:", msg.toString());

    // Broadcast to all other clients
    for (const client of clients) {
      // if (client !== connection) 
      // {
      client.send(msg.toString());
      // }
    }
  });

  // Periodic server message to this client
  const interval = setInterval(() => {
    connection.send("Hello from Fastify server");
  }, 5000);

  // Cleanup on disconnect
  connection.on("close", () => {
    clients.delete(connection);
    clearInterval(interval);
    console.log("Client disconnected. Total clients:", clients.size);
  });
});

fastify.listen({ port: 3000, host: "0.0.0.0" });
