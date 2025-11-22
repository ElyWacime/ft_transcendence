import { FastifyInstance } from "fastify";
import websocket from "@fastify/websocket";
import { PongGame } from "./game.service";
import { ServerMessage, ClientMessage, PlayerNumber } from "./index";

type ClientConn = {
  socket: WebSocket;
  player?: PlayerNumber;
  name?: string;
};

// single global game instance (single room)
const game = new PongGame();
const TICK_MS = 16; // ~60 FPS
const clients = new Set<ClientConn>();

let nextPlayerNumber: PlayerNumber = 1;

export default async function registerWebsocket(fastify: FastifyInstance) {
  await fastify.register(websocket);

  fastify.get("/ws", { websocket: true }, (connection /* Socket */, req) => {
    const ws = connection.socket;
    const conn: ClientConn = { socket: ws, player: undefined, name: undefined };
    clients.add(conn);

    // assign player if available
    if (![...clients].some(c => c.player === 1)) {
      conn.player = 1;
    } else if (![...clients].some(c => c.player === 2)) {
      conn.player = 2;
    } else {
      // room full
      const msg: ServerMessage = { type: "error", message: "Room is full (2 players max)" };
      ws.send(JSON.stringify(msg));
      ws.close();
      clients.delete(conn);
      return;
    }

    // notify client of assignment
    const assignedMsg: ServerMessage = { type: "assigned", player: conn.player };
    ws.send(JSON.stringify(assignedMsg));

    // if two players present, start the game
    if (Array.from(clients).filter(c => c.player).length >= 2) {
      game.start();
    } else {
      // waiting for players
      game.state.gameStatus = "waiting";
      // still send state once so client can render
      const infoMsg: ServerMessage = { type: "info", message: "Waiting for another player..." };
      ws.send(JSON.stringify(infoMsg));
    }

    ws.on("message", (raw: Buffer) => {
      try {
        const parsed = JSON.parse(raw.toString()) as ClientMessage | { type: string; [k: string]: any };

        if (parsed.type === "keydown" && conn.player) {
          const key = (parsed as any).key as string;
          // map key codes to inputs
          if (key === "KeyW") game.setInput(conn.player, "up");
          else if (key === "KeyS") game.setInput(conn.player, "down");
          else if (key === "ArrowUp") game.setInput(conn.player, "up");
          else if (key === "ArrowDown") game.setInput(conn.player, "down");
        } else if (parsed.type === "keyup" && conn.player) {
          const key = (parsed as any).key as string;
          // on keyup stop movement for that player (simple approach)
          if (key === "KeyW" || key === "KeyS" || key === "ArrowUp" || key === "ArrowDown") {
            game.setInput(conn.player, "stop");
          }
        } else if (parsed.type === "hello") {
          conn.name = (parsed as any).name;
        }
      } catch (err) {
        // ignore malformed messages
      }
    });

    ws.on("close", () => {
      clients.delete(conn);
      // free player's input and mark waiting
      if (conn.player) {
        game.setInput(conn.player, "stop");
      }
      // when someone leaves, pause the game and set waiting until 2 players present
      if (Array.from(clients).filter(c => c.player).length < 2) {
        game.state.gameStatus = "waiting";
      }
    });

  });

  // Start broadcast loop
  setInterval(() => {
    // update game physics only if playing
    game.update();

    const stateMsg: ServerMessage = { type: "state", state: game.getStateCopy() };
    const payload = JSON.stringify(stateMsg);

    for (const c of clients) {
      try {
        c.socket.send(payload);
      } catch (err) {
        // ignore send errors (client may be closing)
      }
    }
  }, TICK_MS);
}
