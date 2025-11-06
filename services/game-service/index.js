// import express from "express";
// import { WebSocketServer } from "ws";

// const app = express();
// const PORT = process.env.PORT || 3001;


// // Simple health check route
// app.get("/", (_, res) => res.send("Game service running"));

// const server = app.listen(PORT, () =>
//     console.log(`Game logic service listening on port ${PORT}`)
// );

// // Create a WebSocket server
// const wss = new WebSocketServer({ server });


// wss.on("connection", (ws) => {
//     console.log("Client connected");
//     ws.on("close", () => console.log("Client disconnected"));
// });
