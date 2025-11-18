const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { randomUUID } = require("crypto");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));
//array of tournament // for each tournament an array of matches // for each match two players 
//each connection to server will send userID  tournamentID  matchID paddleposition
//response will be the other player informing him with his opponent new position

// in case just remote match 
//each connection to server will send userID  tournamentID  matchID paddleposition
//response will be the other player informing him with his opponent new position

wss.on("connection", (ws) => {
  const userId = randomUUID();
  console.log(`User connected: ${userId} email:${("email")}`);

  // Tell the client its ID
  ws.send(JSON.stringify({ type: ("email"), id: userId }));

  ws.on("message", (msg) => {
    let data;
    try {
      data = JSON.parse(msg);
      console.log(`msg Received: ${msg}`);
    } catch {
      console.warn("Invalid message received:", msg.toString());
      return;
    }

    if (data.type === "userKeyPress") {
      const event = JSON.stringify({
        type: "userKeyPress",
        id: userId,
        email: data.email,
        key: data.key,
      });

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN)
          client.send(event);
      });
    }
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


