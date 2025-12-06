import Fastify from "fastify";

import websocket from "@fastify/websocket";

const fastify = Fastify({ logger: false });

await fastify.register(websocket);
import { Users, Match, SQLiteDB, GameState } from "./DBController.js";
import { exit } from "process";


let dbcnx = new SQLiteDB();
const TICK_RATE = 60;
const clients = new Map();
const matches = new Map();
const PADDLE_SPEED = 8;

await dbcnx.connect();

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
      m.player3_y = Math.max(0, m.player3_y - PADDLE_SPEED);
    else if (m.p3Downkey)
      m.player3_y = Math.min(m.height - m.sizePaddle_height, m.player3_y + PADDLE_SPEED);
  }
  if (m.P4_Id) {
    if (m.p4UPkey)
      m.player4_y = Math.max(0, m.player4_y - PADDLE_SPEED);
    else if (m.p4Downkey)
      m.player4_y = Math.min(m.height - m.sizePaddle_height, m.player4_y + PADDLE_SPEED);
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
        // console.log("try : ", request.email);
        if (clients.get(request.email) != connection) {
          // console.log("close : ", request.email);
          clients.get(request.email).close();
        }
      }
      catch (e) {
        console.log("error: ", request.email, e);
      }
    }
    clients.set(request.email, connection);
    if (request.type == "REGISTER") {
      let u = new Users();
      u.id = request.id; //to add in localstorage
      u.email = request.email;
      u.User_name = request.email;
      u.isOnline = true;
      u.Auto_Match = true;
      await dbcnx.createUsers(u);
      let m = await dbcnx.getMatchPlayerCanJoin(request.mode);
      if (!m) {
        m = new Match();
        m.P1_Id = u.id;
        m.player1Name = u.User_name;
        if (!request.tournement)
          m.id = await dbcnx.createMatch_not(request.id);
        else {
          // m.T_Id = GET_TORNAMENTID_FROMDB
          m.id = await dbcnx.createMatch(m);
        }
      }
      else {
        if (request.mode == 2) {
          m.P2_Id = u.id;
          m.player2Name = u.User_name;
          m.count_players = 2;
        }
        else {
          if (m.P2_Id == null) {
            m.P2_Id = u.id;
            m.player2Name = u.User_name;
            m.count_players = 2;
          }
          else if (m.P3_Id == null) {
            m.P3_Id = u.id;
            m.player3Name = u.User_name;
            m.count_players = 3;
          }
          else if (m.P4_Id == null) {
            m.P4_Id = u.id;
            m.player4Name = u.User_name;
            m.count_players = 4;
          }
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
          await dbcnx.updateMatch(m);
        }
      }
    }
    else if (request.type == "MOVE") {
      let m = await dbcnx.getCurrentMatchByPlayerID(request.id);
      let match = matches.get(m.id);
      if (match.P1_Id == request.id) {
        match.p1UPkey = request.keys.ArrowUp;
        match.p1Downkey = request.keys.ArrowDown;
      }
      else if (match.P2_Id == request.id) {
        match.p2UPkey = request.keys.ArrowUp;
        match.p2Downkey = request.keys.ArrowDown;
      }
      else if (match.P3_Id && match.P3_Id == request.id) {
        match.p3UPkey = request.keys.ArrowUp;
        match.p3Downkey = request.keys.ArrowDown;
      }
      else if (match.P4_Id && match.P4_Id == request.id) {
        match.p4UPkey = request.keys.ArrowUp;
        match.p4Downkey = request.keys.ArrowDown;
      }
    }
    else if (request.type == "FINISHED") {
      let m = await dbcnx.getFinishedMatchByPlayerID(request.id);
      if (m) {
        if (m.score_player1 >= m.score_player2)
          m.Winner_Id = m.P1_Id;
        else
          m.Winner_Id = m.P2_Id;
        m.gameStatus = "FINISHED";
        await dbcnx.updateMatch(m);
        matches.delete(m.id);
      }
      else
        console.log("getFinishedMatchByPlayerID not Found");
    }
  });
  function sendtoplayer(id, data) {
    if (id) {
      let socket = (clients.get(id));
      if (socket && socket.readyState === 1)
        socket.send(data);
    }
  }
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
        console.log("close old :", email);
        clients.delete(email);
        break;
      }
    }
    clearInterval(interval);
    console.log("Client disconnected. Total clients:", clients.size);
  });
});

fastify.listen({ port: 3000, host: "0.0.0.0" });
