// const express = require("express");
// const http = require("http");
// const WebSocket = require("ws");
// const { randomUUID } = require("crypto");

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// app.use(express.static("public"));

// wss.on("connection", (ws) => {
//   const userId = randomUUID();
//   console.log(`User connected: ${userId} email:${localStorage.getItem("email")}`);

//   // Tell the client its ID
//   ws.send(JSON.stringify({ type: localStorage.getItem("email"), id: userId }));

//   ws.on("message", (msg) => {
//     let data;
//     try {
//       data = JSON.parse(msg);
//       console.log(`msg Received: ${msg}`);
//     } catch {
//       console.warn("Invalid message received:", msg.toString());
//       return;
//     }

//     if (data.type === "userKeyPress") {
//       const event = JSON.stringify({
//         type: "userKeyPress",
//         id: userId,
//         email: data.email,
//         key: data.key,
//       });

//       wss.clients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN)
//           client.send(event);
//       });
//     }
//   });


//   ws.on("close", () => {
//     console.log(`User disconnected: ${userId}`);
//     const event = JSON.stringify({ type: "userDisconnect", id: userId });
//     wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) client.send(event);
//     });
//   });
// });

// server.listen(3000, () =>
//   console.log("✅ Server running on http://localhost:3000")
// );



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
  let userEmail = null;

  console.log(`🟢 User connected: ${userId}`);

  // Wait for client to send email (first message)
  ws.on("message", (msg) => {
    let data;
    try {
      data = JSON.parse(msg);
    } catch {
      console.warn("⚠️ Invalid message received:", msg.toString());
      return;
    }

    // Handle registration
    if (data.type === "register") {
      userEmail = data.email;
      console.log(`✅ Registered user ${userId} (${userEmail})`);

      // Tell this client its own ID
      ws.send(JSON.stringify({ type: "registered", id: userId }));

      // Notify all *other* clients about the new user
      const joinEvent = JSON.stringify({
        type: "userConnected",
        id: userId,
        email: userEmail,
      });

      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(joinEvent);
        }
      });

      return;
    }

    // Handle key press
    if (data.type === "userKeyPress") {
      const event = JSON.stringify({
        type: "userKeyPress",
        id: userId,
        email: userEmail,
        key: data.key,
      });

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) client.send(event);
      });
    }
  });

  ws.on("close", () => {
    console.log(`🔴 User disconnected: ${userId}`);

    const disconnectEvent = JSON.stringify({
      type: "userDisconnect",
      id: userId,
      email: userEmail,
    });

    // Notify everyone
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) client.send(disconnectEvent);
    });
  });
});

server.listen(3000, () =>
  console.log("✅ Server running on http://localhost:3000")
);
