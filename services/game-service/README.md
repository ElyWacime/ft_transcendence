# Game Service (Pong)

Minimal authoritative Pong game server using Socket.IO.

Run locally (dev):

1. cd services/game-service
2. npm install
3. npm run dev

Server listens on port 3001 by default. The frontend can connect via socket.io to `http://localhost:3001` and use the `join` and `input` messages.

Message summary:
- client -> server: `join` { roomId?: string }
- client -> server: `input` { up: boolean, down: boolean }
- server -> client: `joined` { playerId?: 0|1, roomId }
- server -> client: `state` { tick, players: [{y,height},...], ball: {x,y,vx,vy,radius}, score: [n,n] }
