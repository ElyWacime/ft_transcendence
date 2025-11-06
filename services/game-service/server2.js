// const express = require("express");
// const http = require("http");
// const WebSocket = require("ws");

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// // Serve static files (frontend)
// app.use(express.static("public"));

// // WebSocket connection
// wss.on("connection", (ws) => {
//     console.log("New user connected!");

//     ws.on("message", (message) => 
//     {
//         console.log("User pressed key:", message.toString());
//     });

//     ws.on("close", () => {
//         console.log("User disconnected");
//     });
// });

// server.listen(3000, () => {
//     console.log("Server running on http://localhost:3000");
// });


//----------********---------

// const express = require("express");
// const http = require("http");
// const WebSocket = require("ws");
// const { randomUUID } = require("crypto");

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// app.use(express.static("public"));

// wss.on("connection", (ws) => {
//     const userId = randomUUID();
//     console.log(`User connected: ${userId}`);

//     // Tell the client its ID
//     ws.send(JSON.stringify({ type: "init", id: userId }));

//     ws.on("message", (msg) => {
//         const key = msg.toString();

//         // Broadcast to all clients that this user pressed a key
//         const event = JSON.stringify({
//             type: "userKeyPress",
//             id: userId,
//             key: key
//         });

//         wss.clients.forEach(client => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(event);
//             }
//         });
//     });

//     ws.on("close", () => {
//         console.log(`User disconnected: ${userId}`);
//         const event = JSON.stringify({
//             type: "userDisconnect",
//             id: userId
//         });
//         wss.clients.forEach(client => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(event);
//             }
//         });
//     });
// });

// server.listen(3000, () => console.log("Server running on http://localhost:3000"));
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { randomUUID } = require("crypto");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

wss.on("connection", (ws) => {
    const userId = randomUUID();
    console.log(`User connected: ${userId}`);

    // Tell the client its ID
    ws.send(JSON.stringify({ type: "init", id: userId }));

    ws.on("message", (msg) => {
        const key = msg.toString();

        // Broadcast to all clients
        const event = JSON.stringify({
            type: "userKeyPress",
            id: userId,
            key: key,
        });

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) client.send(event);
        });
    });

    ws.on("close", () => {
        console.log(`User disconnected: ${userId}`);
        const event = JSON.stringify({ type: "userDisconnect", id: userId });
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) client.send(event);
        });
    });
});

server.listen(3000, () =>
    console.log("✅ Server running on http://localhost:3000")
);
