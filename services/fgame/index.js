import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fjwt from "@fastify/jwt";  // Default import
import websocket from "@fastify/websocket";
import jwt from 'jsonwebtoken';
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
let max_Speed = 8;

function sendtoplayer(id, data) {
  if (id) {
    let socket = (clients.get(id));
    if (socket && socket.readyState === 1)
      socket.send(data);
    }
}

function moveplayer(m,y,up,down,id)
{
  if (!id) return null;
  if (up)
    y = Math.max(0, y - PADDLE_SPEED);
  else if (down)
    y = Math.min(m.height - m.sizePaddle_height, y + PADDLE_SPEED);
  return y;
}

function playercoli(m,x,y,id, n)
{
  if (!id) return;
  if (n == 1)
  {
    if (
      m.Ball_x - m.ball_radius <= x + m.sizePaddle_width &&
      m.Ball_x - m.ball_radius >= x &&
      m.Ball_y + m.ball_radius >= y &&
      m.Ball_y - m.ball_radius <= y + m.sizePaddle_height &&
      m.Ball_dx < 0
    ) {
         m.Ball_x = x + m.sizePaddle_width + m.ball_radius;
         m.Ball_dx *= -1;
         if (m.Ball_dx * m.Ball_dx + m.Ball_dy * m.Ball_dy < max_Speed * max_Speed) {
           m.Ball_dx *= 1.05;
           m.Ball_dy *= 1.05;
           }
    }
  }
  else if (n == 0)
  {
    if (
      m.Ball_x + m.ball_radius >= x &&
      m.Ball_x + m.ball_radius <= x + m.sizePaddle_width &&
      m.Ball_y + m.ball_radius >= y &&
      m.Ball_y - m.ball_radius <= y + m.sizePaddle_height &&
      m.Ball_dx > 0
    ){
         m.Ball_x = x - m.ball_radius;
         m.Ball_dx = -m.Ball_dx;
         if (m.Ball_dx * m.Ball_dx + m.Ball_dy * m.Ball_dy < max_Speed * max_Speed) {
           m.Ball_dx *= 1.05;
           m.Ball_dy *= 1.05;
    }
    }
  }
}

function tick(m) {
  if (m.gameStatus !== "PLAYING") return;

  m.Player1_y = moveplayer(m, m.Player1_y, m.p1UPkey, m.p1Downkey, m.P1_Id);
  m.Player2_y = moveplayer(m, m.Player2_y, m.p2UPkey, m.p2Downkey, m.P2_Id);
  m.Player3_y = moveplayer(m, m.Player3_y, m.p3UPkey, m.p3Downkey, m.P3_Id);
  m.Player4_y = moveplayer(m, m.Player4_y, m.p4UPkey, m.p4Downkey, m.P4_Id);
  m.Ball_x += m.Ball_dx;
  m.Ball_y += m.Ball_dy;

  if (m.Ball_y - m.ball_radius <= 0 || m.Ball_y + m.ball_radius >= m.height) {
    m.Ball_dy *= -1;
    m.Ball_y = Math.max(m.ball_radius, Math.min(m.height - m.ball_radius, m.Ball_y));
  }

  playercoli(m, m.Player1_x, m.Player1_y, m.P1_Id,1);
  playercoli(m, m.Player3_x, m.Player3_y, m.P3_Id,1);
  playercoli(m, m.Player2_x, m.Player2_y, m.P2_Id,0);
  playercoli(m, m.Player4_x, m.Player4_y, m.P4_Id,0);

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



fastify.register(fjwt, { 
  secret: process.env.JWT_ACCESS_SECRET
});

// --- THIS HOOK IS CRITICAL ---
fastify.addHook("preHandler", (req, _res, next) => {
  req.jwt = fastify.jwt;
  next();
});

// --- Cookies ---
fastify.register(fastifyCookie, {
  secret: process.env.JWT_ACCESS_SECRET,
  hook: "preHandler",
});

fastify.get('/', async (request, reply) => {
  return { message: 'Server is running' };
});

fastify.get("/ws", { websocket: true }, async (connection, req) => {
  connection.on("message", async (msg) => {
      const request = JSON.parse(msg);
      const token = request.token;
      if (token) {
        // try {
          const decoded = req.jwt.verify(token);
          // console.log("✅ Authentication successful!");
          // console.log(decoded);
          const id = decoded.id;
          const email = decoded.email;
          const name = decoded.name;
          console.log(id, email, name);
          if (clients.has(id)) {
            try {
              // console.log("\n\n>>>>>try : ", email);
              if (clients.get(id) != connection) {
                // console.log("\n\n>>>>>close : ", email);
                clients.get(id).close();
              }
            }
            catch (e) {
              // console.log("\n\n>>>>>error: ", email, e);
            }
          }
          clients.set(id, connection);
          if (request.type == "REGISTER") {
            let u = new Users();
            u.id = id; //to add in localstorage
            u.email = email;
            u.User_name = name;
            u.isOnline = true;
            u.Auto_Match = true;
            // console.log("BUser  ===== ", u);
            await dbcnx.createUsers(u);
            u = await dbcnx.getUserById(u.id);
            // console.log("getUserById  ===== ", u);
            // console.log("AUser  ===== ", v);
            // console.log("\n\n>>>>>getOngoingMatchByPlayerID: ");
            let m = await dbcnx.getOngoingMatchByPlayerID(id);
            // let m = await dbcnx.getOngoingMatchByPlayerID(id, request.mode);
            if (!m) {
              // console.log("\n\n>>>>>Player is not in Match ", id);
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

                  console.log("\n\n>>>05550000>>updateMatch: ",m);

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
                  console.log("\n\n>>>00000>>updateMatch: ",m);
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
                  ngame.player1Name = m.player1Name;
                  ngame.player2Name = m.player2Name;
                  ngame.player3Name = m.player3Name;
                  ngame.player4Name = m.player4Name;
                  ngame.gameStatus = m.gameStatus;
                  ngame.T_Id = m.T_Id;
                  ngame.count_players = m.count_players;
                  ngame.mode = m.mode;
                  matches.set(m.id, ngame);
                  // console.log("\n\n>>>>>updateMatch: ");
                  console.log("\n\n>>>111100000>>updateMatch: ",m);
                  await dbcnx.updateMatch(m);
                }
              }
              let ngame = new GameState();
              ngame.id_Match = m.id;
              ngame.P1_Id = m.P1_Id;
              ngame.P2_Id = m.P2_Id;
              ngame.P3_Id = m.P3_Id;
              ngame.P4_Id = m.P4_Id;
              ngame.player1Name = m.player1Name;
              ngame.player2Name = m.player2Name;
              ngame.player3Name = m.player3Name;
              ngame.player4Name = m.player4Name;
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
            // console.log("\n\n>>>>>Player in Match ", id);
          }
          else if (request.type == "MOVE") {
            let m = await dbcnx.getCurrentMatchByPlayerID(id);
            if (m) {
              let match = matches.get(m.id);
              if (match.P1_Id == id) {
                match.p1UPkey = request.keys.ArrowUp;
                match.p1Downkey = request.keys.ArrowDown;
                // console.log("\n\n>>>>>Move: ", id);
                // console.log(match.P1_Id, match.p1UPkey, match.p1Downkey);
              }
              else if (match.P2_Id == id) {
                match.p2UPkey = request.keys.ArrowUp;
                match.p2Downkey = request.keys.ArrowDown;
                // console.log("\n\n>>>>>Move: ", id);
                // console.log(match.P2_Id, match.p2UPkey, match.p2Downkey);
              }
              else if (match.P3_Id && match.P3_Id == id) {
                match.p3UPkey = request.keys.ArrowUp;
                match.p3Downkey = request.keys.ArrowDown;
                // console.log("\n\n>>>>>Move: ", id);
                // console.log(match.P3_Id, match.p3UPkey, match.p3Downkey);
              }
              else if (match.P4_Id && match.P4_Id == id) {
                match.p4UPkey = request.keys.ArrowUp;
                match.p4Downkey = request.keys.ArrowDown;
                // console.log("\n\n>>>>>Move: ", id);
                // console.log(match.P4_Id, match.p4UPkey, match.p4Downkey);
              }
            }
            else {
              m = await dbcnx.getLasttMatchByPlayerID(id);
              if (m) {
                let data = JSON.stringify(m);
                sendtoplayer(m.P1_Id, data);
                sendtoplayer(m.P2_Id, data);
                sendtoplayer(m.P3_Id, data);
                sendtoplayer(m.P4_Id, data);
              }
              else
                console.log("getLasttMatchByPlayerID NOT FOUND",id);
            }
          }
          else if (request.type == "FINISHED") {
            // console.log("\n\n>>>>>getLasttMatchByPlayerID: ");
            let m = await dbcnx.getLasttMatchByPlayerID(id);
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
            await dbcnx.deletePendingMatchByPlayerID(id);
            // await dbcnx.deleteOngoingMatchByPlayerID(id);
          }
        }
        // catch (jwtErr) {
        //   console.log("❌ JWT verification failed:", jwtErr);
        // }
      // }
      else 
        console.log("⚠️ No token provided, proceeding without authentication");
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
    for (const [id, client] of clients) {
      if (client == connection) {
        // console.log("\n\n>>>>>close old :", id);
        clients.delete(id);
        break;
      }
    }
    clearInterval(interval);
    // console.log("\n\n>>>>>Client disconnected. Total clients:", clients.size);
  });
});

fastify.listen({ port: 3000, host: "0.0.0.0" });
