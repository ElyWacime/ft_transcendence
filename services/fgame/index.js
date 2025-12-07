import Fastify from "fastify";

import websocket from "@fastify/websocket";

const fastify = Fastify({ logger: false });

await fastify.register(websocket);
import { Users, Match, SQLiteDB, GameState } from "./DBController.js";
import { exit } from "process";


let dbcnx = new SQLiteDB();
const TICK_RATE = 10;
const clients = new Map();
const matches = new Map();
const PADDLE_SPEED = 8;

await dbcnx.connect();
// Collision with top/bottom
// if (m.Ball_y + m.Ball_radius >= m.height) {
//   m.Ball_dy = -m.Ball_dy;
//   m.Ball_y = m.height - m.Ball_radius;
// } else if (m.Ball_y - m.Ball_radius <= 0) {
//   m.Ball_dy = -m.Ball_dy;
//   m.Ball_y = m.Ball_radius;
// }



// Paddle collisions
// if (
//   m.Ball_x - m.Ball_radius <= m.Player1_x + m.sizePaddle_width &&
//   m.Ball_x - m.Ball_radius >= m.Player1_x &&
//   m.Ball_y + m.Ball_radius >= m.Player1_y &&
//   m.Ball_y - m.Ball_radius <= m.Player1_y + m.sizePaddle_height &&
//   m.Ball_dx < 0
// ) {
//   m.Ball_x = m.Player1_x + m.sizePaddle_width + m.Ball_radius;
//   m.Ball_dx = -m.Ball_dx;
// }

// if (
//   m.Ball_x + m.Ball_radius >= m.Player2_x &&
//   m.Ball_x + m.Ball_radius <= m.Player2_x + m.sizePaddle_width &&
//   m.Ball_y + m.Ball_radius >= m.Player2_y &&
//   m.Ball_y - m.Ball_radius <= m.Player2_y + m.sizePaddle_height &&
//   m.Ball_dx > 0
// ) {
//   m.Ball_x = m.Player2_x - m.Ball_radius;
//   m.Ball_dx = -m.Ball_dx;
// }

// if (m.P3_Id &&
//   m.Ball_x - m.Ball_radius <= m.Player3_x + m.sizePaddle_width &&
//   m.Ball_x - m.Ball_radius >= m.Player3_x &&
//   m.Ball_y + m.Ball_radius >= m.Player3_y &&
//   m.Ball_y - m.Ball_radius <= m.Player3_y + m.sizePaddle_height &&
//   m.Ball_dx < 0
// ) {
//   m.Ball_x = m.Player3_x + m.sizePaddle_width + m.Ball_radius;
//   m.Ball_dx = -m.Ball_dx;
// }

// if (m.P4_Id &&
//   m.Ball_x + m.Ball_radius >= m.Player4_x &&
//   m.Ball_x + m.Ball_radius <= m.Player4_x + m.sizePaddle_width &&
//   m.Ball_y + m.Ball_radius >= m.Player4_y &&
//   m.Ball_y - m.Ball_radius <= m.Player4_y + m.sizePaddle_height &&
//   m.Ball_dx > 0
// ) {
//   m.Ball_x = m.Player4_x - m.Ball_radius;
//   m.Ball_dx = -m.Ball_dx;
// }

let max_Speed = 8;

function sendtoplayer(id, data) {
  if (id) {
    let socket = (clients.get(id));
    if (socket && socket.readyState === 1)
      socket.send(data);
  }
}

function tick(m) {
  if (m.gameStatus !== "PLAYING") return;
  m.Ball_x += m.Ball_dx;
  m.Ball_y += m.Ball_dy;
  if (m.Ball_y - m.ball_radius <= 0 || m.Ball_y + m.ball_radius >= m.height) {
    m.Ball_dy *= -1;
    m.Ball_y = Math.max(m.ball_radius, Math.min(m.height - m.ball_radius, m.Ball_y));
  }

  if (m.Ball_x - m.ball_radius <= m.Player1_x + m.sizePaddle_width) {
    if (m.Ball_y >= m.Player1_y && m.Ball_y <= m.Player1_y + m.sizePaddle_height) {
      m.Ball_dx = Math.abs(m.Ball_dx);
      m.Ball_dx *= 1.05;
    }
  }
  if (m.Ball_x + m.ball_radius >= m.Player2_x) {
    if (m.Ball_y >= m.Player2_y && m.Ball_y <= m.Player2_y + m.sizePaddle_height) {
      m.Ball_dx = -Math.abs(m.Ball_dx);
      m.Ball_dx *= 1.05;
    }
  }

  if (m.P3_Id && m.Ball_x - m.ball_radius <= m.Player3_x + m.sizePaddle_width) {
    if (m.Ball_y >= m.Player3_y && m.Ball_y <= m.Player3_y + m.sizePaddle_height) {
      m.Ball_dx = Math.abs(m.Ball_dx);
      m.Ball_dx *= 1.05;
    }
  }
  if (m.P4_Id && m.Ball_x + m.ball_radius >= m.Player4_x) {
    if (m.Ball_y >= m.Player4_y && m.Ball_y <= m.Player4_y + m.sizePaddle_height) {
      m.Ball_dx = -Math.abs(m.Ball_dx);
      m.Ball_dx *= 1.05;
    }
  }

  if (m.p1UPkey)
    m.Player1_y = Math.max(0, m.Player1_y - PADDLE_SPEED);
  else if (m.p1Downkey)
    m.Player1_y = Math.min(m.height - m.sizePaddle_height, m.Player1_y + PADDLE_SPEED);
  if (m.p2UPkey)
    m.Player2_y = Math.max(0, m.Player2_y - PADDLE_SPEED);
  else if (m.p2Downkey)
    m.Player2_y = Math.min(m.height - m.sizePaddle_height, m.Player2_y + PADDLE_SPEED);
  if (m.P3_Id) {
    if (m.p3UPkey)
      m.Player3_y = Math.max(0, m.Player3_y - PADDLE_SPEED);
    else if (m.p3Downkey)
      m.Player3_y = Math.min(m.height - m.sizePaddle_height, m.Player3_y + PADDLE_SPEED);
  }
  if (m.P4_Id) {
    if (m.p4UPkey)
      m.Player4_y = Math.max(0, m.Player4_y - PADDLE_SPEED);
    else if (m.p4Downkey)
      m.Player4_y = Math.min(m.height - m.sizePaddle_height, m.Player4_y + PADDLE_SPEED);
  }
  if (m.Ball_x < 0) {
    m.score2 += 1;
    resetBall(-1, m);
  } else if (m.Ball_x > m.width) {
    m.score1 += 1;
    resetBall(1, m);
  }
  if (m.score2 == 5 || m.score1 == 5)
    m.gameStatus = "FINISHED";
}

function resetBall(direction = 1, m) {
  m.Ball_x = m.width / 2;
  m.Ball_y = m.height / 2;
  m.Ball_dx = 2 * direction;
  m.Ball_dy = 2;
}

fastify.get('/', async (request, reply) => {
  return { message: 'Server is running' };
});

fastify.get("/ws", { websocket: true }, async (connection, req) => {
  connection.on("message", async (msg) => {
    const request = JSON.parse(msg);
    if (clients.has(request.email)) {
      try {
        // console.log("\n\n>>>>>try : ", request.email);
        if (clients.get(request.email) != connection) {
          // console.log("\n\n>>>>>close : ", request.email);
          clients.get(request.email).close();
        }
      }
      catch (e) {
        // console.log("\n\n>>>>>error: ", request.email, e);
      }
    }
    // console.log("\n\n>>>>>request.type ==== ", request.type);
    clients.set(request.email, connection);
    if (request.type == "REGISTER") {
      let u = new Users();
      u.id = request.id; //to add in localstorage
      u.email = request.email;
      u.User_name = request.email;
      u.isOnline = true;
      u.Auto_Match = true;
      await dbcnx.createUsers(u);
      // console.log("\n\n>>>>>getOngoingMatchByPlayerID: ");
      let m = await dbcnx.getOngoingMatchByPlayerID(request.id);
      // let m = await dbcnx.getOngoingMatchByPlayerID(request.id, request.mode);
      if (!m) {
        // console.log("\n\n>>>>>Player is not in Match ", request.id);
        // console.log("\n\n>>>>>getMatchPlayerCanJoin: ");
        m = await dbcnx.getMatchPlayerCanJoin(request.mode);
        if (!m) {
          // console.log("\n\n\t\t>>>>> Can't JOIN Need To Create: ");
          m = new Match();
          m.P1_Id = u.id;
          m.player1Name = u.User_name;
          m.mode = request.mode;
          if (!request.tournement) {
            // console.log("\n\n>>>>>createMatch_not: ");
            m.id = await dbcnx.createMatch_not(m);
          }
          else {
            // console.log("\n\n>>>>>createMatch: ");
            // m.T_Id = GET_TORNAMENTID_FROMDB
            m.id = await dbcnx.createMatch(m);
          }
        }
        else {
          // console.log("\n\n\t\t>>>>> Can JOIN: ");
          if (request.mode == 2) {
            m.P2_Id = u.id;
            m.player2Name = u.User_name;
            m.count_players = m.count_players + 1;
          }
          else {
            if (m.P2_Id == null) {
              m.P2_Id = u.id;
              m.player2Name = u.User_name;
              m.count_players = m.count_players + 1;
            }
            else if (m.P3_Id == null) {
              m.P3_Id = u.id;
              m.player3Name = u.User_name;
              m.count_players = m.count_players + 1;
            }
            else if (m.P4_Id == null) {
              m.P4_Id = u.id;
              m.player4Name = u.User_name;
              m.count_players = m.count_players + 1;
            }
            // console.log("\n\n>>>>>updateMatch: ");
            await dbcnx.updateMatch(m);
          }
          if (m.count_players == m.mode) {
            m.gameStatus = "PLAYING";
            let ngame = new GameState();
            ngame.id_Match = m.id;
            ngame.P1_Id = m.P1_Id;
            ngame.P2_Id = m.P2_Id;
            ngame.P3_Id = m.P3_Id;
            ngame.P4_Id = m.P4_Id;
            ngame.player1Name = m.P1_Id;
            ngame.player2Name = m.P2_Id;
            ngame.player3Name = m.P3_Id;
            ngame.player4Name = m.P4_Id;
            ngame.gameStatus = m.gameStatus;
            ngame.T_Id = m.T_Id;
            ngame.count_players = m.count_players;
            ngame.mode = m.mode;
            matches.set(m.id, ngame);
            // console.log("\n\n>>>>>updateMatch: ");
            await dbcnx.updateMatch(m);
          }
        }
        let ngame = new GameState();
        ngame.id_Match = m.id;
        ngame.P1_Id = m.P1_Id;
        ngame.P2_Id = m.P2_Id;
        ngame.P3_Id = m.P3_Id;
        ngame.P4_Id = m.P4_Id;
        ngame.player1Name = m.P1_Id;
        ngame.player2Name = m.P2_Id;
        ngame.player3Name = m.P3_Id;
        ngame.player4Name = m.P4_Id;
        ngame.gameStatus = m.gameStatus;
        ngame.T_Id = m.T_Id;
        ngame.count_players = m.count_players;
        ngame.mode = m.mode;
        let data = JSON.stringify(ngame);
        sendtoplayer(ngame.P1_Id, data);
        sendtoplayer(ngame.P2_Id, data);
        sendtoplayer(ngame.P3_Id, data);
        sendtoplayer(ngame.P4_Id, data);
      }
      // else
      // console.log("\n\n>>>>>Player in Match ", request.id);
    }
    else if (request.type == "MOVE") {
      let m = await dbcnx.getCurrentMatchByPlayerID(request.id);
      if (m) {
        let match = matches.get(m.id);
        if (match.P1_Id == request.id) {
          match.p1UPkey = request.keys.ArrowUp;
          match.p1Downkey = request.keys.ArrowDown;
          // console.log("\n\n>>>>>Move: ", request.id);
          // console.log(match.P1_Id, match.p1UPkey, match.p1Downkey);
        }
        else if (match.P2_Id == request.id) {
          match.p2UPkey = request.keys.ArrowUp;
          match.p2Downkey = request.keys.ArrowDown;
          // console.log("\n\n>>>>>Move: ", request.id);
          // console.log(match.P2_Id, match.p2UPkey, match.p2Downkey);
        }
        else if (match.P3_Id && match.P3_Id == request.id) {
          match.p3UPkey = request.keys.ArrowUp;
          match.p3Downkey = request.keys.ArrowDown;
          // console.log("\n\n>>>>>Move: ", request.id);
          // console.log(match.P3_Id, match.p3UPkey, match.p3Downkey);
        }
        else if (match.P4_Id && match.P4_Id == request.id) {
          match.p4UPkey = request.keys.ArrowUp;
          match.p4Downkey = request.keys.ArrowDown;
          // console.log("\n\n>>>>>Move: ", request.id);
          // console.log(match.P4_Id, match.p4UPkey, match.p4Downkey);
        }
      }
      else {
        m = await dbcnx.getLasttMatchByPlayerID(request.id);
        let data = JSON.stringify(m);
        sendtoplayer(m.P1_Id, data);
        sendtoplayer(m.P2_Id, data);
        sendtoplayer(m.P3_Id, data);
        sendtoplayer(m.P4_Id, data);
      }

    }
    else if (request.type == "FINISHED") {
      // console.log("\n\n>>>>>getLasttMatchByPlayerID: ");
      let m = await dbcnx.getLasttMatchByPlayerID(request.id);
      if (m) {
        let tmp = matches.get(m.id);
        // console.log("\n\n>>>>>tmp === ", tmp);
        if (tmp) {
          m.score1 = tmp.score1;
          m.score2 = tmp.score2;
        }
        if (m.score1 >= m.score2)
          m.Winner_Id = m.P1_Id;
        else
          m.Winner_Id = m.P2_Id;
        m.gameStatus = "FINISHED";
        // console.log("\n\n>>>>>updateMatch: ");
        await dbcnx.updateMatch(m);
        matches.delete(m.id);
      }
      // else
      //  console.log("\n\n>>>>>getFinishedMatchByPlayerID not Found");
    }
    else if (request.type == "DELETE") {
      // console.log("\n\n>>>>>deletePendingMatchByPlayerID: ");
      await dbcnx.deletePendingMatchByPlayerID(request.id);
      // await dbcnx.deleteOngoingMatchByPlayerID(request.id);
    }
  });

  const interval = setInterval(() => {
    if (clients.size == 0)
      return;
    for (const [id, match] of matches) {
      tick(match);
      let data = JSON.stringify(match);
      sendtoplayer(match.P1_Id, data);
      sendtoplayer(match.P2_Id, data);
      sendtoplayer(match.P3_Id, data);
      sendtoplayer(match.P4_Id, data);
    }
  }, 1000 / TICK_RATE);

  connection.on("close", () => {
    // get the match if finished delete it from matches else leave it 
    for (const [email, client] of clients) {
      if (client == connection) {
        // console.log("\n\n>>>>>close old :", email);
        clients.delete(email);
        break;
      }
    }
    clearInterval(interval);
    // console.log("\n\n>>>>>Client disconnected. Total clients:", clients.size);
  });
});

fastify.listen({ port: 3000, host: "0.0.0.0" });
