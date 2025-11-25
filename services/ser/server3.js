import Fastify from "fastify";
import fastifyWebsocket from "fastify-websocket";

const fastify = Fastify({ logger: true });

fastify.register(fastifyWebsocket);

fastify.get("/ws", { websocket: true }, (connection, req) => {
    console.log("Client connected!");

    connection.socket.on("message", (message) => {
        console.log("Received:", message.toString());

        // Broadcast to all connected clients
        for (const client of fastify.websocketServer.clients) {
            if (client.readyState === 1) {
                client.send(message.toString());
            }
        }
    });

    connection.socket.on("close", () => {
        console.log("Client disconnected");
    });
});

fastify.listen({ port: 3000 }, (err) => {
    if (err) throw err;
    console.log("Fastify running on http://localhost:3000");
});
