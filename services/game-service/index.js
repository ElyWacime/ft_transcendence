import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const PORT = process.env.PORT || 3001;

// Simple health check route
app.get("/", (_, res) => res.send("Game service running"));

const server = app.listen(PORT, () =>
    console.log(`Game logic service listening on port ${PORT}`)
);

// Create a WebSocket server
const wss = new WebSocketServer({ server });

// Game rooms (in-memory for now)
const games = new Map();

function createGameRoom(id) {
    return {
        players: [],
        ball: { x: 400, y: 300, dx: 5, dy: 3 },
        paddles: {
            left: { y: 250 },
            right: { y: 250 },
        },
    };
}

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (msg) => {
        const data = JSON.parse(msg);
        const { type, payload } = data;

        if (type === "createGame") {
            const roomId = Math.random().toString(36).substring(2, 8);
            const room = createGameRoom(roomId);
            games.set(roomId, room);
            ws.send(JSON.stringify({ type: "gameCreated", roomId }));
        }

        if (type === "joinGame") {
            const room = games.get(payload.roomId);
            if (!room) return ws.send(JSON.stringify({ type: "error", message: "Room not found" }));

            room.players.push(ws);
            ws.roomId = payload.roomId;
            ws.send(JSON.stringify({ type: "joinedGame", roomId: payload.roomId }));

            if (room.players.length === 2) {
                startGame(roomId);
            }
        }

        if (type === "paddleMove") {
            const room = games.get(ws.roomId);
            if (!room) return;
            const side = payload.side;
            room.paddles[side].y = payload.y;
        }
    });

    ws.on("close", () => console.log("Client disconnected"));
});

function startGame(roomId) {
    const room = games.get(roomId);
    const { players, ball, paddles } = room;

    const loop = setInterval(() => {
        // Simple physics
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.y <= 0 || ball.y >= 600) ball.dy = -ball.dy;

        // Broadcast state to both players
        players.forEach((p) =>
            p.send(JSON.stringify({ type: "stateUpdate", payload: { ball, paddles } }))
        );
    }, 16);

    room.loop = loop;
}
