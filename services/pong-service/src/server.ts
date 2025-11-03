import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8081;
const FPS = 60;
const TICK_MS = 1000 / FPS;

// Physics constants (match frontend)
const SPIN_FACTOR = 0.08;
const MAX_DY = 6;
const BALL_SPEED = 0.9; // match frontend
const WALL_BOUNCE_DY_REDUCTION = 0.6;
const PADDLE_SPEED = 2;
const CANVAS_W = 800;
const CANVAS_H = 600;

type Vec2 = { x: number; y: number };

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Score {
  player1: number;
  player2: number;
}

interface GameState {
  ball: Ball;
  paddle1: Paddle;
  paddle2: Paddle;
  score: Score;
  gameStatus: 'playing' | 'paused' | 'finished' | 'waiting';
}

interface Room {
  id: number;
  players: Array<WebSocket | null>;
  inputs: [InputState | null, InputState | null];
  state: GameState;
}

interface InputState {
  up: boolean;
  down: boolean;
}

function createInitialState(): GameState {
  const angle = (Math.random() - 0.5) * (Math.PI / 6);
  const dir = Math.random() > 0.5 ? 1 : -1;
  const ball: Ball = {
    x: CANVAS_W / 2,
    y: CANVAS_H / 2,
    dx: dir * BALL_SPEED * Math.cos(angle),
    dy: BALL_SPEED * Math.sin(angle),
    radius: 8,
  };
  return {
    ball,
    paddle1: { x: 20, y: 250, width: 15, height: 100 },
    paddle2: { x: CANVAS_W - 35, y: 250, width: 15, height: 100 },
    score: { player1: 0, player2: 0 },
    gameStatus: 'playing'
  };
}

function resetBall(state: GameState) {
  const angle = (Math.random() - 0.5) * (Math.PI / 6);
  const dir = Math.random() > 0.5 ? 1 : -1;
  state.ball = {
    x: CANVAS_W / 2,
    y: CANVAS_H / 2,
    dx: dir * BALL_SPEED * Math.cos(angle),
    dy: BALL_SPEED * Math.sin(angle),
    radius: 8,
  };
}

function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }

function stepPhysics(state: GameState, inputs: [InputState | null, InputState | null]) {
  // Move paddles
  const i0 = inputs[0];
  const i1 = inputs[1];
  if (i0) {
    if (i0.up) state.paddle1.y -= PADDLE_SPEED;
    if (i0.down) state.paddle1.y += PADDLE_SPEED;
  }
  if (i1) {
    if (i1.up) state.paddle2.y -= PADDLE_SPEED;
    if (i1.down) state.paddle2.y += PADDLE_SPEED;
  }
  state.paddle1.y = clamp(state.paddle1.y, 0, CANVAS_H - state.paddle1.height);
  state.paddle2.y = clamp(state.paddle2.y, 0, CANVAS_H - state.paddle2.height);

  // Move ball
  const ball = state.ball;
  ball.x += ball.dx;
  ball.y += ball.dy;

  // top/bottom collision
  if (ball.y <= ball.radius) {
    ball.dy = Math.abs(ball.dy) || 0.5;
    ball.dy *= WALL_BOUNCE_DY_REDUCTION;
    ball.dy = clamp(ball.dy, -MAX_DY, MAX_DY);
    const signX = Math.sign(ball.dx) || (Math.random() > 0.5 ? 1 : -1);
    const dyAbs = Math.abs(ball.dy);
    const dxMag = Math.sqrt(Math.max(0, BALL_SPEED * BALL_SPEED - dyAbs * dyAbs));
    ball.dx = signX * dxMag;
    ball.y = ball.radius;
  } else if (ball.y >= CANVAS_H - ball.radius) {
    ball.dy = -Math.abs(ball.dy) || -0.5;
    ball.dy *= WALL_BOUNCE_DY_REDUCTION;
    ball.dy = clamp(ball.dy, -MAX_DY, MAX_DY);
    const signX = Math.sign(ball.dx) || (Math.random() > 0.5 ? 1 : -1);
    const dyAbs = Math.abs(ball.dy);
    const dxMag = Math.sqrt(Math.max(0, BALL_SPEED * BALL_SPEED - dyAbs * dyAbs));
    ball.dx = signX * dxMag;
    ball.y = CANVAS_H - ball.radius;
  }

  // paddle collisions
  const p1 = state.paddle1;
  const p2 = state.paddle2;

  if (ball.x - ball.radius <= p1.x + p1.width && ball.y >= p1.y && ball.y <= p1.y + p1.height && ball.dx < 0) {
    ball.x = p1.x + p1.width + ball.radius;
    ball.dx = -ball.dx;
    ball.dy += (ball.y - (p1.y + p1.height / 2)) * SPIN_FACTOR;
    ball.dy = clamp(ball.dy, -MAX_DY, MAX_DY);
    const speed = Math.hypot(ball.dx, ball.dy) || 1;
    const scale = BALL_SPEED / speed;
    ball.dx *= scale; ball.dy *= scale;
  }

  if (ball.x + ball.radius >= p2.x && ball.y >= p2.y && ball.y <= p2.y + p2.height && ball.dx > 0) {
    ball.x = p2.x - ball.radius;
    ball.dx = -ball.dx;
    ball.dy += (ball.y - (p2.y + p2.height / 2)) * SPIN_FACTOR;
    ball.dy = clamp(ball.dy, -MAX_DY, MAX_DY);
    const speed = Math.hypot(ball.dx, ball.dy) || 1;
    const scale = BALL_SPEED / speed;
    ball.dx *= scale; ball.dy *= scale;
  }

  // scoring
  if (ball.x < 0) {
    state.score.player2++;
    resetBall(state);
  } else if (ball.x > CANVAS_W) {
    state.score.player1++;
    resetBall(state);
  }
}

function broadcastRoom(room: Room) {
  const payload = JSON.stringify({ type: 'state', state: room.state });
  room.players.forEach((ws) => {
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(payload);
  });
}

const server = http.createServer();
const wss = new WebSocketServer({ server });

let waiting: { ws: WebSocket; roomId: number } | null = null;
const rooms = new Map<number, Room>();
let nextRoomId = 1;

wss.on('connection', (ws: WebSocket) => {
  // attach properties dynamically
  (ws as any).isAlive = true;

  ws.on('pong', () => { (ws as any).isAlive = true; });

  ws.on('message', (raw) => {
    let msg: any;
    try { msg = JSON.parse(raw.toString()); } catch (e) { return; }
    if (msg.type === 'join') {
      if (waiting == null) {
        const roomId = nextRoomId++;
        const room: Room = { id: roomId, players: [ws, null], inputs: [null, null], state: createInitialState() };
        rooms.set(roomId, room);
        waiting = { ws, roomId };
        (ws as any)._roomId = roomId;
        (ws as any)._playerIndex = 0;
        ws.send(JSON.stringify({ type: 'assign', player: 1 }));
      } else {
        const roomId = waiting.roomId;
        const room = rooms.get(roomId)!;
        room.players[1] = ws;
        (ws as any)._roomId = roomId;
        (ws as any)._playerIndex = 1;
        room.players.forEach((socket, idx) => {
          if (socket && socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'assign', player: idx + 1 }));
        });
        waiting = null;
      }
    } else if (msg.type === 'input') {
      const roomId = (ws as any)._roomId as number | undefined;
      const idx = (ws as any)._playerIndex as number | undefined;
      if (!roomId || idx == null) return;
      const room = rooms.get(roomId);
      if (!room) return;
      room.inputs[idx] = { up: !!msg.up, down: !!msg.down };
    }
  });

  ws.on('close', () => {
    const roomId = (ws as any)._roomId as number | undefined;
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) return;
    room.players.forEach((s) => {
      if (s && s !== ws && s.readyState === WebSocket.OPEN) s.send(JSON.stringify({ type: 'peer_left' }));
    });
    rooms.delete(roomId);
    if (waiting && waiting.ws === ws) waiting = null;
  });
});

// Main loop: step each room
setInterval(() => {
  for (const room of rooms.values()) {
    stepPhysics(room.state, room.inputs);
    broadcastRoom(room);
  }
}, TICK_MS);

// ping/pong to clean dead sockets
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!(ws as any).isAlive) return ws.terminate();
    (ws as any).isAlive = false;
    ws.ping(() => {});
  });
}, 30000);

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Pong server listening on ${PORT}`);
});
