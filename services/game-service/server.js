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

  // Send the user their ID
  ws.send(
    JSON.stringify({ type: "init", id: userId })
  );

  ws.on("message", (msg) => {
    let data;
    try {
      data = JSON.parse(msg);
      console.log(`Message received:`, data);
    } catch {
      console.warn("Invalid JSON message:", msg.toString());
      return;
    }

    // Relay key press to the other player ONLY
    if (data.type === "userKeyPress") {
      const event = JSON.stringify({
        type: "userKeyPress",
        id: userId,       // sender ID
        key: data.key,    // key pressed
      });

      // 🔥 RE-BROADCAST TO ALL OTHER CLIENTS
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(event);
        }
      });
    }
  });

  ws.on("close", () => {
    console.log(`User disconnected: ${userId}`);

    const event = JSON.stringify({
      type: "userDisconnect",
      id: userId,
    });

    // Notify all remaining clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) client.send(event);
    });
  });
});

server.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
