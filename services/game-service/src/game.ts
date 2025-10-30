import { Socket } from "socket.io";

export type Vec2 = { x: number; y: number };

export interface PlayerSlot {
  id: 0 | 1;
  socket: Socket;
  name?: string;
}

export interface InputState {
  up: boolean;
  down: boolean;
}

export interface WorldState {
  tick: number;
  players: [
    { y: number; height: number },
    { y: number; height: number }
  ];
  ball: { x: number; y: number; vx: number; vy: number; radius: number };
  score: [number, number];
}

const TICK_RATE = 30; // server ticks per second
const DT = 1 / TICK_RATE;

export class GameRoom {
  id: string;
  players: Array<PlayerSlot | null> = [null, null];
  inputs: [InputState, InputState] = [ { up: false, down: false }, { up: false, down: false } ];
  state: WorldState;
  running = false;
  private tickTimer?: NodeJS.Timer;
  private tick = 0;

  constructor(id: string) {
    this.id = id;
    this.state = this.createInitialState();
  }

  private createInitialState(): WorldState {
    return {
      tick: 0,
      players: [{ y: 250, height: 100 }, { y: 250, height: 100 }],
      ball: { x: 400, y: 300, vx: 200, vy: 60, radius: 8 },
      score: [0,0]
    };
  }

  addPlayer(socket: Socket): number | null {
    for (let i = 0; i < 2; i++) {
      if (!this.players[i]) {
        this.players[i] = { id: i as 0|1, socket };
        socket.join(this.id);
        socket.data.roomId = this.id;
        socket.data.playerId = i;
        // send joined message with assigned id
        socket.emit('joined', { playerId: i, roomId: this.id });
        this.broadcastRoomInfo();
        if (this.playerCount() === 2 && !this.running) {
          this.start();
        }
        return i;
      }
    }
    // room full -> spectator (not implemented)
    socket.emit('full', { roomId: this.id });
    return null;
  }

  removePlayer(socket: Socket) {
    for (let i = 0; i < 2; i++) {
      if (this.players[i] && this.players[i]!.socket.id === socket.id) {
        this.players[i] = null;
        socket.leave(this.id);
        delete socket.data.roomId;
        delete socket.data.playerId;
        this.broadcastRoomInfo();
      }
    }
    if (this.playerCount() === 0) {
      this.stop();
    }
  }

  playerCount() {
    return this.players.filter(Boolean).length;
  }

  broadcastRoomInfo() {
    const info = { players: this.players.map(p => p ? p.id : null) };
    // emit to everyone in the room
    if (this.players[0]) this.players[0]!.socket.to(this.id).emit('roomInfo', info);
    // also send to each player's socket individually
    for (const p of this.players) {
      if (p) p.socket.emit('roomInfo', info);
    }
  }

  handleInput(playerId: number, input: InputState) {
    if (playerId === 0 || playerId === 1) {
      this.inputs[playerId] = input;
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.tick = 0;
    this.state = this.createInitialState();
    this.tickTimer = setInterval(() => this.step(), 1000 / TICK_RATE);
  }

  stop() {
    this.running = false;
    if (this.tickTimer) {
      clearInterval(this.tickTimer);
      this.tickTimer = undefined;
    }
  }

  private step() {
    this.tick++;
    // apply inputs
    const paddleSpeed = 300; // pixels per second
    for (let i = 0; i < 2; i++) {
      const inp = this.inputs[i];
      if (!inp) continue;
      if (inp.up) this.state.players[i].y -= paddleSpeed * DT;
      if (inp.down) this.state.players[i].y += paddleSpeed * DT;
      // clamp
      this.state.players[i].y = Math.max(0, Math.min(600 - this.state.players[i].height, this.state.players[i].y));
    }

    // move ball
    const b = this.state.ball;
    b.x += b.vx * DT;
    b.y += b.vy * DT;

    // wall bounce
    if (b.y <= b.radius) {
      b.y = b.radius;
      b.vy = Math.abs(b.vy);
    } else if (b.y >= 600 - b.radius) {
      b.y = 600 - b.radius;
      b.vy = -Math.abs(b.vy);
    }

    // paddle collision
    const p1 = this.state.players[0];
    const p2 = this.state.players[1];
    // left paddle
    if (b.x - b.radius <= 20 + 15 && b.y >= p1.y && b.y <= p1.y + p1.height && b.vx < 0) {
      b.x = 20 + 15 + b.radius;
      b.vx = -b.vx;
      // add slight spin based on hit point
      const diff = b.y - (p1.y + p1.height / 2);
      b.vy += diff * 2;
    }
    // right paddle
    if (b.x + b.radius >= 765 && b.y >= p2.y && b.y <= p2.y + p2.height && b.vx > 0) {
      b.x = 765 - b.radius;
      b.vx = -b.vx;
      const diff = b.y - (p2.y + p2.height / 2);
      b.vy += diff * 2;
    }

    // scoring
    if (b.x < 0) {
      this.state.score[1]++;
      this.resetBall(1);
    } else if (b.x > 800) {
      this.state.score[0]++;
      this.resetBall(0);
    }

    // dampen velocity slightly and normalize speed
    const speed = Math.hypot(b.vx, b.vy) || 1;
    const targetSpeed = 250;
    b.vx = (b.vx / speed) * targetSpeed;
    b.vy = (b.vy / speed) * targetSpeed;

    this.state.tick = this.tick;

    // broadcast state to room
    this.broadcastState();
  }

  private resetBall(lastScoredFor: number) {
    const dir = lastScoredFor === 0 ? 1 : -1;
    this.state.ball.x = 400;
    this.state.ball.y = 300;
    this.state.ball.vx = dir * 200;
    this.state.ball.vy = (Math.random() - 0.5) * 120;
  }

  broadcastState() {
    const payload = {
      tick: this.state.tick,
      players: this.state.players,
      ball: this.state.ball,
      score: this.state.score
    };
    // send to all sockets in the room
    for (const p of this.players) {
      if (p) p.socket.emit('state', payload);
    }
  }
}
