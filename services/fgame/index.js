import Fastify from "fastify";

import websocket from "@fastify/websocket";

const fastify = Fastify({ logger: false });

await fastify.register(websocket);

const TICK_RATE = 60;

const PADDLE_SPEED = 10;

let gameState = {
  ball: { x: 400, y: 300, dx: 2, dy: 2, radius: 8 },
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
  gameStatus: "waiting"
};

const clients = new Set();

function tick() {
  if (gameState.gameStatus !== "playing") return;
  gameState.ball.x += gameState.ball.dx;
  gameState.ball.y += gameState.ball.dy;
  if (gameState.ball.y - gameState.ball.radius <= 0 || gameState.ball.y + gameState.ball.radius >= gameState.height) {
    gameState.ball.dy *= -1;
    gameState.ball.y = Math.max(gameState.ball.radius, Math.min(gameState.height - gameState.ball.radius, gameState.ball.y));
  }
  if (gameState.ball.x - gameState.ball.radius <= gameState.paddle1.x + gameState.sizePaddle.width) {
    if (gameState.ball.y >= gameState.paddle1.y && gameState.ball.y <= gameState.paddle1.y + gameState.sizePaddle.height) {
      gameState.ball.dx = Math.abs(gameState.ball.dx);
      gameState.ball.dx *= 1.05;
    }
  }
  if (gameState.ball.x + gameState.ball.radius >= gameState.paddle2.x) {
    if (gameState.ball.y >= gameState.paddle2.y && gameState.ball.y <= gameState.paddle2.y + gameState.sizePaddle.height) {
      gameState.ball.dx = -Math.abs(gameState.ball.dx);
      gameState.ball.dx *= 1.05;
    }
  }
  if (gameState.ball.x < 0) {
    gameState.score2 += 1;
    resetBall(-1);
  } else if (gameState.ball.x > gameState.width) {
    gameState.score1 += 1;
    resetBall(1);
  }
  if (gameState.score2 == 5 || gameState.score1 == 5)
    gameState.gameStatus = "finished";
}

function resetBall(direction = 1) {
  gameState.ball.x = gameState.width / 2;
  gameState.ball.y = gameState.height / 2;
  gameState.ball.dx = 2 * direction;
  gameState.ball.dy = 2;
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
      else if (gameState.player2Name == "" && request.email != gameState.player1Name)
        gameState.player2Name = request.email;
    }

    if (request.type == "reset") {
      gameState.gameStatus = "playing";
      gameState.score1 = 0;
      gameState.score2 = 0;
      resetBall(1);
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
    if (clients.size == 2) {
      if (gameState.gameStatus != "playing")
        gameState.gameStatus = "playing";
      for (const client of clients) {
        client.send(JSON.stringify(gameState));
      }
    }
  });

  const interval = setInterval(() => {
    if (clients.size === 0) return;
    tick();
    connection.send(JSON.stringify(gameState));
  }, TICK_RATE);
  connection.on("close", () => {
    clients.delete(connection);
    clearInterval(interval);
    console.log("Client disconnected. Total clients:", clients.size);
  });
});

fastify.listen({ port: 3000, host: "0.0.0.0" });
