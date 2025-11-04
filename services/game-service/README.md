# pong-service

Minimal server-authoritative Pong server using WebSocket (`ws`).

Run (development):

```bash
cd services/pong-service
npm install
npm run dev
```

Build & run (production):

```bash
cd services/pong-service
npm install
npm run build
npm start
```

Default port: 8081. The server pairs two clients into a room, runs physics at 60 FPS and broadcasts authoritative state updates.

Protocol (JSON messages):

Client -> Server:
- { type: 'join' }
- { type: 'input', up: boolean, down: boolean }

Server -> Client:
- { type: 'assign', player: 1|2 }
- { type: 'state', state: { ball, paddle1, paddle2, score, gameStatus } }
- { type: 'peer_left' }

