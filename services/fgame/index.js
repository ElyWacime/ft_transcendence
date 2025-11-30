import Fastify from "fastify";

import websocket from "@fastify/websocket";

const fastify = Fastify({ logger: false });

await fastify.register(websocket);

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
  gameStatus: "waiting",
  count: 0,
  p1keys: { ArrowUp: false, ArrowDown: false },
  p2keys: { ArrowUp: false, ArrowDown: false }
};

const email1 = "www@www.w";
const email2 = "qaqq@qqaq.q";
const clients = new Set();
const PADDLE_SPEED = 8;
const TICK_RATE = 60;

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
  if (gameState.p1keys.ArrowUp)
    gameState.paddle1.y = Math.max(0, gameState.paddle1.y - PADDLE_SPEED);
  else if (gameState.p1keys.ArrowDown)
    gameState.paddle1.y = Math.min(gameState.height - gameState.sizePaddle.height, gameState.paddle1.y + PADDLE_SPEED);
  if (gameState.p2keys.ArrowUp)
    gameState.paddle2.y = Math.max(0, gameState.paddle2.y - PADDLE_SPEED);
  else if (gameState.p2keys.ArrowDown)
    gameState.paddle2.y = Math.min(gameState.height - gameState.sizePaddle.height, gameState.paddle2.y + PADDLE_SPEED);
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
    // "insert into match values ()"
    if (request.type == "register") {
      if (request.email == email1 && gameState.player1Name == "") {
        gameState.player1Name = request.email;
        gameState.count++;
      }
      else if (request.email == email2 && gameState.player2Name == "") {
        gameState.player2Name = request.email;
        gameState.count++;
      }
    }
    if (request.type == "reset") {
      gameState.gameStatus = "playing";
      gameState.score1 = 0;
      gameState.score2 = 0;
      resetBall(1);
    }
    if (request.email == email1) {
      gameState.p1keys.ArrowUp = request.keys.ArrowUp;
      gameState.p1keys.ArrowDown = request.keys.ArrowDown;
    }
    else if (request.email == email2) {
      gameState.p2keys.ArrowUp = request.keys.ArrowUp;
      gameState.p2keys.ArrowDown = request.keys.ArrowDown;
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
    if (clients.size === 0)
      return;
    tick();
    connection.send(JSON.stringify(gameState));
  }, 1000 / TICK_RATE);
  connection.on("close", () => {
    clients.delete(connection);
    clearInterval(interval);
    console.log("Client disconnected. Total clients:", clients.size);
  });
});

fastify.listen({ port: 3000, host: "0.0.0.0" });
