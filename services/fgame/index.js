import Fastify from "fastify";
import websocket from "@fastify/websocket";

const fastify = Fastify({ logger: false });

await fastify.register(websocket);
let players = {}; // { wsId: { email, role, socket } }
const TICK_RATE = 60; // ticks per second
const PADDLE_SPEED = 10;

let gameState = {
  ball: { x: 400, y: 300, dx: 2, dy: 2, radius: 8 },
  // ball: { x: 400, y: 300, dx: Math.cos(Math.PI / 8), dy: Math.sin(Math.PI / 8), radius: 8 },
  paddle1: { x: 20, y: 250 },
  paddle2: { x: 765, y: 250 },
  paddle3: { x: 60, y: 250 },
  paddle4: { x: 725, y: 250 },
  width: 800,
  height: 600,
  score1: 0,
  score2: 0,
  sizePaddle: { width: 15, height: 100 },
  player1Name: "",
  player2Name: "",
  gameStatus: "waiting" // waiting | playing | paused
};
// Keep track of all connected clients
const clients = new Set();

// // --- Server-side game tick: ball movement and collision ---
function tick() {
  if (gameState.gameStatus !== "playing") return;

  // Move ball
  gameState.ball.x += gameState.ball.dx;
  gameState.ball.y += gameState.ball.dy;

  // Top/Bottom wall collision
  if (gameState.ball.y - gameState.ball.radius <= 0 || gameState.ball.y + gameState.ball.radius >= gameState.height) {
    gameState.ball.dy *= -1;
    // clamp position
    gameState.ball.y = Math.max(gameState.ball.radius, Math.min(gameState.height - gameState.ball.radius, gameState.ball.y));
  }

  // Paddle collisions (simple AABB -> circle approx)
  // Left paddle
  if (gameState.ball.x - gameState.ball.radius <= gameState.paddle1.x + gameState.sizePaddle.width) {
    if (gameState.ball.y >= gameState.paddle1.y && gameState.ball.y <= gameState.paddle1.y + gameState.sizePaddle.height) {
      gameState.ball.dx = Math.abs(gameState.ball.dx); // bounce right
      // small speed up
      gameState.ball.dx *= 1.05;
    }
  }

  // Right paddle
  if (gameState.ball.x + gameState.ball.radius >= gameState.paddle2.x) {
    if (gameState.ball.y >= gameState.paddle2.y && gameState.ball.y <= gameState.paddle2.y + gameState.sizePaddle.height) {
      gameState.ball.dx = -Math.abs(gameState.ball.dx); // bounce left
      gameState.ball.dx *= 1.05;
    }
  }

  // Scoring: ball passed left or right
  if (gameState.ball.x < 0) {
    // point for player2
    gameState.score2 += 1;
    resetBall(-1);
    // broadcast({ type: "score", gameState });
  } else if (gameState.ball.x > gameState.width) {
    gameState.score1 += 1;
    resetBall(1);
    // broadcast({ type: "score", gameState });
  }
  if (gameState.score2 == 5 || gameState.score1 == 5)
    gameState.gameStatus = "finished";


  // Broadcast state each tick (you can decimate frequency if needed)
  // broadcast({ type: "state", gameState });
}

function resetBall(direction = 1) {
  gameState.ball.x = gameState.width / 2;
  gameState.ball.y = gameState.height / 2;
  gameState.ball.dx = 3 * direction;
  gameState.ball.dy = 2 * (Math.random() > 0.5 ? 1 : -1);
}


fastify.get('/', async (request, reply) => {
  return { message: 'Server is running' };
});


fastify.get("/ws", { websocket: true }, (connection, req) => {
  clients.add(connection);
  console.log("Client connected. Total clients:", clients.size);
  connection.on("message", (msg) => {
    const request = JSON.parse(msg);

    if (request.type == "register") {
      if (gameState.player1Name == "")
        gameState.player1Name = request.email;
      else if (gameState.player2Name == "")
        gameState.player2Name = request.email;
    }
    if (request.email == "www@www.w") {
      if (request.direction === "up")
        gameState.paddle1.y = Math.max(0, gameState.paddle1.y - PADDLE_SPEED);
      else if (request.direction === "down")
        gameState.paddle1.y = Math.min(gameState.height - gameState.sizePaddle.height, gameState.paddle1.y + PADDLE_SPEED);
    } else if (request.email == "qaqq@qqaq.q") {
      if (request.direction === "up")
        gameState.paddle2.y = Math.max(0, gameState.paddle2.y - PADDLE_SPEED);
      else if (request.direction === "down")
        gameState.paddle2.y = Math.min(gameState.height - gameState.sizePaddle.height, gameState.paddle2.y + PADDLE_SPEED);
    }
    // tick(1);
    if (clients.size == 2) {
      if (gameState.gameStatus != "playing")
        gameState.gameStatus = "playing";
      for (const client of clients) {
        client.send(JSON.stringify(gameState));
      }
    }
  });

  // const interval = setInterval(() => {
  //   tick(1 / TICK_RATE);
  //   // console.log("5s Updates from Fastify server");
  //   connection.send(JSON.stringify(gameState));
  // }, 10000);

  // Periodic server message to this client
  const interval = setInterval(() => {
    tick();
    connection.send(JSON.stringify(gameState));
    // console.log("5s Updates from Fastify server");
  }, TICK_RATE);

  // Cleanup on disconnect
  connection.on("close", () => {
    clients.delete(connection);
    clearInterval(interval);
    console.log("Client disconnected. Total clients:", clients.size);
  });
});



fastify.listen({ port: 3000, host: "0.0.0.0" });

// import Fastify from "fastify";
// import websocket from "@fastify/websocket";

// const fastify = Fastify({ logger: true });

// await fastify.register(websocket);

// // Keep track of all connected clients
// const clients = new Set();
// import { randomUUID } from "crypto";

// // --- Shared game state ---




// // --- WebSocket route ---
// // fastify.get("/ws", { websocket: true }, (connection /* { socket } */, req) => {
// //   const ws = connection.socket;
// //   ws.id = randomUUID();

// //   fastify.log.info(`WS connected: ${ws.id}`);

// //   ws.on("message", (raw) => {
// //     let data;
// //     try {
// //       data = JSON.parse(raw.toString());
// //     } catch (err) {
// //       fastify.log.warn("Invalid JSON from client", err);
// //       return;
// //     }

// //     // Register player (first message should be register)
// //     if (data.type === "register") {
// //       players[ws.id] = {
// //         email: data.email || `guest-${ws.id.slice(0, 6)}`,
// //         role: Object.values(players).some(p => p.role === "player1") ? "player2" : "player1",
// //         socket: ws
// //       };

// //       fastify.log.info(`Registered ${players[ws.id].email} as ${players[ws.id].role}`);

// //       send(ws, { type: "role", role: players[ws.id].role });

// //       // If two players are connected, start the game
// //       if (Object.keys(players).length >= 2 && gameState.gameStatus !== "playing") {
// //         gameState.gameStatus = "playing";
// //         broadcast({ type: "start", gameState });
// //         fastify.log.info("Game started");
// //       }

// //       return;
// //     }

// //     // Movement messages
// //     if (data.type === "move") {
// //       const p = players[ws.id];
// //       if (!p) return;
// //       if (p.role === "player1") {
// //         if (data.direction === "up") gameState.paddle1.y = Math.max(0, gameState.paddle1.y - PADDLE_SPEED);
// //         if (data.direction === "down") gameState.paddle1.y = Math.min(gameState.height - gameState.paddle1.height, gameState.paddle1.y + PADDLE_SPEED);
// //       } else if (p.role === "player2") {
// //         if (data.direction === "up") gameState.paddle2.y = Math.max(0, gameState.paddle2.y - PADDLE_SPEED);
// //         if (data.direction === "down") gameState.paddle2.y = Math.min(gameState.height - gameState.paddle2.height, gameState.paddle2.y + PADDLE_SPEED);
// //       }

// //       // After applying movement, broadcast authoritative state
// //       broadcast({ type: "state", gameState });
// //       return;
// //     }

// //     // Optional: handle ping/pong or custom messages
// //   });

// //   ws.on("close", () => {
// //     fastify.log.info(`WS disconnected: ${ws.id}`);
// //     delete players[ws.id];

// //     // If less than 2 players, pause the game
// //     if (Object.keys(players).length < 2 && gameState.gameStatus === "playing") {
// //       gameState.gameStatus = "waiting";
// //       broadcast({ type: "pause", reason: "player-disconnect", gameState });
// //     }
// //   });

// //   // send initial "waiting" state
// //   send(ws, { type: "state", gameState });
// // });


// fastify.get("/ws", { websocket: true }, (connection, req) => {
//   clients.add(connection);
//   console.log("Client connected. Total clients:", clients.size);

//     // Handle incoming messages from this client
//     connection.on("message", (msg) => {
//     console.log("Received:", msg.toString());

//     // Broadcast to all other clients
//     for (const client of clients) {
//       if (client !== connection) {
//         client.send(msg.toString());
//       }
//     }
//   });

//   // Periodic server message to this client
//   const interval = setInterval(() => {
//     connection.send("Hello from Fastify server");
//   }, 5000);

//   // Cleanup on disconnect
//   connection.on("close", () => {
//     clients.delete(connection);
//     clearInterval(interval);
//     console.log("Client disconnected. Total clients:", clients.size);
//   });
// });

// // Helpers
// function send(ws, obj) {
//   try {
//     if (ws && ws.readyState === ws.OPEN) ws.send(JSON.stringify(obj));
//   } catch (err) {
//     fastify.log.error("Failed to send", err);
//   }
// }

// function broadcast(obj) {
//   for (const id in players) {
//     const p = players[id];
//     if (p && p.socket && p.socket.readyState === p.socket.OPEN) {
//       try { p.socket.send(JSON.stringify(obj)); } catch (err) { fastify.log.error(err); }
//     }
//   }
// }

// // Start server
// fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
//   if (err) {
//     fastify.log.error(err);
//     process.exit(1);
//   }
//   fastify.log.info(`Fastify WebSocket server listening on ${address} (ws://localhost:3000/ws)`);
// });
