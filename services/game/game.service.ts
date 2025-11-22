import { GameState, PlayerNumber } from "./index";

const WIDTH = 800;
const HEIGHT = 600;
const BALL_SPEED = 5;
const PADDLE_SPEED = 8;
const ACCEL = 1.002;
const MAX_SPEED = 25;
const ANGLE = Math.PI / 8;

export class PongGame {
  state: GameState;
  // input state for each player: "up" | "down" | "stop"
  inputs: { [p in PlayerNumber]: "up" | "down" | "stop" } = {
    1: "stop",
    2: "stop"
  };

  constructor() {
    this.state = this.createInitialState();
  }

  private createInitialState(): GameState {
    return {
      ball: {
        x: WIDTH / 2,
        y: HEIGHT / 2,
        dx: BALL_SPEED * Math.cos(ANGLE),
        dy: BALL_SPEED * Math.sin(ANGLE),
        radius: 8
      },
      paddle1: { x: 20, y: 250, width: 15, height: 100 },
      paddle2: { x: WIDTH - 35, y: 250, width: 15, height: 100 },
      score: { player1: 0, player2: 0 },
      gameStatus: "waiting"
    };
  }

  resetBall() {
    const dirx = Math.random() > 0.5 ? 1 : -1;
    const diry = Math.random() > 0.5 ? 1 : -1;
    this.state.ball = {
      x: WIDTH / 2,
      y: HEIGHT / 2,
      dx: dirx * BALL_SPEED * Math.cos(ANGLE),
      dy: diry * BALL_SPEED * Math.sin(ANGLE),
      radius: 8
    };
  }

  start() {
    this.state.gameStatus = "playing";
  }

  stop() {
    this.state.gameStatus = "paused";
  }

  // set player's input
  setInput(player: PlayerNumber, kind: "up" | "down" | "stop") {
    this.inputs[player] = kind;
  }

  // one step update (authoritative physics)
  update() {
    if (this.state.gameStatus !== "playing") return;

    const s = this.state;

    // paddles
    if (this.inputs[1] === "up") s.paddle1.y -= PADDLE_SPEED;
    if (this.inputs[1] === "down") s.paddle1.y += PADDLE_SPEED;

    if (this.inputs[2] === "up") s.paddle2.y -= PADDLE_SPEED;
    if (this.inputs[2] === "down") s.paddle2.y += PADDLE_SPEED;

    // clamp paddles inside play area
    s.paddle1.y = Math.max(0, Math.min(HEIGHT - s.paddle1.height, s.paddle1.y));
    s.paddle2.y = Math.max(0, Math.min(HEIGHT - s.paddle2.height, s.paddle2.y));

    // ball movement
    s.ball.x += s.ball.dx;
    s.ball.y += s.ball.dy;

    // accelerate a bit up to max speed
    if (s.ball.dx * s.ball.dx + s.ball.dy * s.ball.dy < MAX_SPEED * MAX_SPEED) {
      s.ball.dx *= ACCEL;
      s.ball.dy *= ACCEL;
    }

    // top/bottom collisions
    if (s.ball.y <= s.ball.radius) {
      s.ball.y = s.ball.radius;
      s.ball.dy = -s.ball.dy;
    }
    if (s.ball.y >= HEIGHT - s.ball.radius) {
      s.ball.y = HEIGHT - s.ball.radius;
      s.ball.dy = -s.ball.dy;
    }

    // left paddle collision (player 1)
    const p1 = s.paddle1;
    if (
      s.ball.x - s.ball.radius <= p1.x + p1.width &&
      s.ball.x - s.ball.radius >= p1.x &&
      s.ball.y + s.ball.radius >= p1.y &&
      s.ball.y - s.ball.radius <= p1.y + p1.height &&
      s.ball.dx < 0
    ) {
      s.ball.x = p1.x + p1.width + s.ball.radius;
      s.ball.dx = -s.ball.dx;
    }

    // right paddle collision (player 2)
    const p2 = s.paddle2;
    if (
      s.ball.x + s.ball.radius >= p2.x &&
      s.ball.x + s.ball.radius <= p2.x + p2.width &&
      s.ball.y + s.ball.radius >= p2.y &&
      s.ball.y - s.ball.radius <= p2.y + p2.height &&
      s.ball.dx > 0
    ) {
      s.ball.x = p2.x - s.ball.radius;
      s.ball.dx = -s.ball.dx;
    }

    // scoring
    if (s.ball.x < 0) {
      s.score.player2 += 1;
      this.resetBall();
    } else if (s.ball.x > WIDTH) {
      s.score.player1 += 1;
      this.resetBall();
    }
  }

  // return a copy suitable for sending to clients
  getStateCopy(): GameState {
    return JSON.parse(JSON.stringify(this.state)) as GameState;
  }
}
