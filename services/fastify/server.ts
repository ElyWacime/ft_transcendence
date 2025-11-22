// import Fastify from 'fastify';

// const fastify = Fastify({
//   logger: true,
// });

// fastify.get('/', async () => {
//   return { message: 'Hello from Fastify + TypeScript + Docker!' };
// });

// const start = async () => {
//   try {
//     await fastify.listen({ port: 3000, host: '0.0.0.0' }); // IMPORTANT for Docker
//     console.log('>>>> Server running at http://localhost:3000');
//   } catch (err) {
//     fastify.log.error("errd :::: " + err);
//     process.exit(1);
//   }
// };
// start();



// import Fastify from 'fastify';
// import websocketPlugin from '@fastify/websocket';
// import type { FastifyRequest } from 'fastify';

// const fastify = Fastify({ logger: true });

// // Register WS plugin
// fastify.register(websocketPlugin);

// // WebSocket route
// fastify.get(
//   '/ws',
//   { websocket: true },
//   (connection, req: FastifyRequest) => {
//     console.log("WS client connected");

//     connection.socket.on("message", (msg:any)=> {
//       console.log("Client:", msg.toString());
//       connection.socket.send("Server received: " + msg);
//     });

//     connection.socket.on("close", () => {
//       console.log("WS client disconnected");
//     });
//   }
// );

// // HTTP endpoint
// fastify.get('/', async () => {
//   return { message: 'Hello from Fastify!' };
// });

// // Start server
// fastify.listen({ port: 3000, host: '0.0.0.0' });




// import Fastify from "fastify";
// import websocketPlugin from "@fastify/websocket";
// import type { FastifyRequest } from "fastify";

// const fastify = Fastify({ logger: false });

// // Register WebSocket plugin
// fastify.register(websocketPlugin);

// // WebSocket route — fully typed now!
// fastify.get(
//   "/",
//   { websocket: true },
//   (connection, req: FastifyRequest) => 
//     {
//     console.log("----WS client connected");

//     connection.socket.on("message", (msg: Buffer) => {
//       const message = msg.toString();
//       console.log(">>>>>>> Client: >>>>>>> ", message);
//       connection.socket.send("Server received: " + message);
//     });

//     connection.socket.on("close", () => {
//       console.log("---- WS client disconnected");
//     });

//     connection.socket.on("error", (err:any) => {
//       console.error("WS error:", err);
//     });
//   }
// );

// fastify.listen({ port: 3000, host: "0.0.0.0" });




import Fastify from "fastify";
import websocketPlugin from "@fastify/websocket";
import type { FastifyRequest } from "fastify";

const fastify = Fastify({ logger: false });
fastify.register(websocketPlugin);

// Track all connected clients
interface Player {
  socket: any;
  email: string;
}
const clients = new Map<any, Player>();

// WebSocket route
fastify.get("/", { websocket: true }, (connection, req: FastifyRequest) => {
  console.log("Client connected");

  // Expect the client to send an initial "init" message with their email
  connection.socket.on("message", (msg: Buffer) => {
    try {
      const data = JSON.parse(msg.toString());

      if (data.type === "init") {
        clients.set(connection, { socket: connection.socket, email: data.email });
        console.log(`Player initialized: ${data.email}`);
        return;
      }

      if (data.type === "userKeyPress") {
        const player = clients.get(connection);
        if (!player) return;

        console.log(`Player ${player.email} pressed: ${data.key}`);

        // Broadcast key press to all other players
        for (const [clientConn, client] of clients.entries()) {
          if (clientConn !== connection && client.socket.readyState === client.socket.OPEN) {
            client.socket.send(JSON.stringify({
              type: "userKeyPress",
              key: data.key,
              email: player.email
            }));
          }
        }
      }
    } catch (err) {
      console.error("Failed to parse message:", err);
    }
  });

  connection.socket.on("close", () => {
    const player = clients.get(connection);
    if (player) {
      clients.delete(connection);
      console.log(`Player disconnected: ${player.email}`);
    } else {
      console.log("Unknown client disconnected");
    }
  });

  connection.socket.on("error", (err: any) => {
    console.error("WS error:", err);
  });
});

// Start server
fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`WS server listening at ${address}`);
});
