// Minimal server-authoritative Pong server using ws
// - pairs two clients into a room
// - runs server-side physics at 60 FPS
// - clients send input { type: 'input', up: boolean, down: boolean }
// - server broadcasts full authoritative state { type: 'state', state }

const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8081;
const FPS = 60;
const TICK_MS = 1000 / FPS;

// Physics constants (match frontend)
const SPIN_FACTOR = 0.08;
const MAX_DY = 6;
// Use the same units as the frontend (pixels per frame at ~60FPS)
const BALL_SPEED = 0.9; // match frontend's BALL_SPEED
const WALL_BOUNCE_DY_REDUCTION = 0.6;
const PADDLE_SPEED = 2;
const CANVAS_W = 800;
const CANVAS_H = 600;

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let waiting = null; // waiting socket
let rooms = new Map(); // roomId -> { players: [ws1, ws2], state, inputs }
let nextRoomId = 1;

function createInitialState() {
  const angle = (Math.random() - 0.5) * (Math.PI / 6);
  const dir = Math.random() > 0.5 ? 1 : -1;
  const ball = {
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

function resetBall(state) {
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

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

function stepPhysics(state, inputs) {
  // inputs: [ {up, down}, {up, down} ] for player1 and player2
  // Move paddles
  if (inputs[0]) {
    if (inputs[0].up) state.paddle1.y -= PADDLE_SPEED;
    if (inputs[0].down) state.paddle1.y += PADDLE_SPEED;
  }
  if (inputs[1]) {
    if (inputs[1].up) state.paddle2.y -= PADDLE_SPEED;
    if (inputs[1].down) state.paddle2.y += PADDLE_SPEED;
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

  // left
  if (ball.x - ball.radius <= p1.x + p1.width && ball.y >= p1.y && ball.y <= p1.y + p1.height && ball.dx < 0) {
    ball.x = p1.x + p1.width + ball.radius;
    // apply spin
    ball.dx = -ball.dx;
    ball.dy += (ball.y - (p1.y + p1.height / 2)) * SPIN_FACTOR;
    ball.dy = clamp(ball.dy, -MAX_DY, MAX_DY);
    // normalize speed
    const speed = Math.hypot(ball.dx, ball.dy) || 1;
    const scale = BALL_SPEED / speed;
    ball.dx *= scale; ball.dy *= scale;
  }

  // right
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

  // game end not handled here (clients decide)
}

function broadcastRoom(room) {
  const payload = JSON.stringify({ type: 'state', state: room.state });
  room.players.forEach(ws => {
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(payload);
  });
}

wss.on('connection', (ws) => {
  ws.isAlive = true;

  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch (e) { return; }
    if (msg.type === 'join') {
      // pair
      if (waiting == null) {
        const roomId = nextRoomId++;
        const room = { id: roomId, players: [ws], inputs: [{}, {}], state: createInitialState() };
        rooms.set(roomId, room);
        waiting = { ws, roomId };
        ws._roomId = roomId;
        ws._playerIndex = 0;
        ws.send(JSON.stringify({ type: 'assign', player: 1 }));
      } else {
        // join waiting's room
        const roomId = waiting.roomId;
        const room = rooms.get(roomId);
        room.players[1] = ws;
        ws._roomId = roomId;
        ws._playerIndex = 1;
        // notify second player
        room.players.forEach((socket, idx) => {
          if (socket && socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'assign', player: idx + 1 }));
        });
        waiting = null;
      }
    } else if (msg.type === 'input') {
      const roomId = ws._roomId;
      const idx = ws._playerIndex;
      if (!roomId || idx == null) return;
      const room = rooms.get(roomId);
      room.inputs[idx] = { up: !!msg.up, down: !!msg.down };
    }
  });

  ws.on('close', () => {
    const roomId = ws._roomId;
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) return;
    // inform other player
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
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping(() => {});
  });
}, 30000);

server.listen(PORT, () => {
  console.log(`Pong server listening on ${PORT}`);
});
