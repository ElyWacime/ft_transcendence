import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fjwt from "@fastify/jwt";  // Default import
import websocket from "@fastify/websocket";
import cors from "@fastify/cors";
import jwt from 'jsonwebtoken';
const fastify = Fastify({ logger: false });

await fastify.register(websocket);
//ayoub//
await fastify.register(cors, {
  origin: ['http://10.11.8.4'],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
});
//ayoub//
import { Users, Match, SQLiteDB, GameState } from "./DBController.js";
import { registerTournamentRoutes } from "./tournament_routes.js";
import { exit } from "process";

let dbcnx = new SQLiteDB();
const TICK_RATE = 50;
export const clients = new Map();
export const matches = new Map();
const PADDLE_SPEED = 4;

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

async function advanceIfReady  (tId) {
  const winners = await dbcnx.getwinnerIDs(tId);
  // Not enough matches yet
  if (!winners) return;
  else
    console.log("Winners not found:", winners);
  // If any winner is NULL, stop
  // if (!winners.every(w => w.Winner_Id)) {
  //   console.log("Waiting for all winners...");
  //   return;
  // }
  console.log("Winners ready:", winners);
  // const [a, b] = winners.map(w => w.Winner_Id);
  const m = new Match();
  m.round = 2;
  m.T_Id = tId;
  m.P1_Id = winners[0].id;
  m.P2_Id = winners[1].id;
  m.count_players = 2;
  m.gameStatus = "PLAYING";
  const matchId = await this.db.createMatch(m);
  m.id = matchId;
  await this.db.updateMatch(m);
  console.log("Final match created");
  let socket = clients.get(m.P1_Id);
  if (socket && socket.readyState === 1)
    socket.send(JSON.stringify({ type: 'redirect', tournamentId: tId }));
  else
    console.log("No socket for player ", m.P1_Id);
  socket = clients.get(m.P2_Id);
  if (socket && socket.readyState === 1)
    socket.send(JSON.stringify({ type: 'redirect', tournamentId: tId }));
  else
    console.log("No socket for player ", m.P2_Id);
}


fastify.get("/ws", { websocket: true }, async (connection, req) => {
  connection.on("message", async (msg) => {
    const request = JSON.parse(msg);
      const token = request.token;
      if (token) {
          const decoded = req.jwt.verify(token);
          const id = decoded.id;
          const email = decoded.email;
          const name = decoded.name;
          if (clients.has(id)) {
            try {
              // //console.log("\n\n>>>>>try : ", email);
              //console.log("\n\n>>>1111>>close : ", email);
              if (clients.get(id) != connection) {
                console.log("\n\nclose SOCKET FOR : ", id);
                clients.get(id).close();
              }
            }
            catch (e) {
              // //console.log("\n\n>>>>>error: ", email, e);
            }
          }
          clients.set(id, connection);
          if (request.type == "REGISTER") {
            let u = new Users();
            u.id = id;
            u.email = email;
            u.User_name = name;
            u.isOnline = true;
            u.Auto_Match = true;
            await dbcnx.createUsers(u);
            u = await dbcnx.getUserById(u.id);
            let m = await dbcnx.getOngoingMatchByPlayerID(id);
            if (!m) {
              // let tournamentId = request.tournement?.tournamentId || request.tournamentId || null;
              // if (tournamentId) {
              //   m = await dbcnx.getTournamentOpenMatch(tournamentId);
              //   if (!m) {
              //     m = await dbcnx.getMatchPlayerCanJoin(request.mode);
              //   }
              // } else
              // {
              //   m = await dbcnx.getMatchPlayerCanJoin(request.mode);
              // }
              m = await dbcnx.getMatchPlayerCanJoin(request.mode);
              if (!m) {
                m = new Match();
                m.P1_Id = u.id;
                let resuser = await dbcnx.getUserById(u.id);
                m.player1Name = resuser.User_name;
                m.mode = request.mode;
                if (!request.tournement) {
                  m.id = await dbcnx.createMatch_not(m);
                } else {
                  // m.T_Id = tournamentId;
                  // m.round = 1;
                  // m.id = await dbcnx.createMatch(m);
                }
              }
              else
              {
                if (request.mode == 2)
                {
                  m.P2_Id = u.id;
                  let resuser = await dbcnx.getUserById(u.id);
                  m.player2Name = resuser.User_name;
                  m.count_players = m.count_players + 1;
                }
                else {
                  if (m.P2_Id == null) {
                    m.P2_Id = u.id;
                
                    let resuser = await dbcnx.getUserById(u.id);
                    
                    m.player2Name = resuser.User_name;
                    m.count_players = m.count_players + 1;
                  }
                  else if (m.P3_Id == null) {
                    m.P3_Id = u.id;
                
                    let resuser = await dbcnx.getUserById(u.id);
                    
                    m.player3Name = resuser.User_name;
                    m.count_players = m.count_players + 1;
                  }
                  else if (m.P4_Id == null) {
                    m.P4_Id = u.id;
                
                    let resuser = await dbcnx.getUserById(u.id);
                    
                    m.player4Name = resuser.User_name;
                    m.count_players = m.count_players + 1;
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
                  let resuser = await dbcnx.getUserById(m.P1_Id);
                  if (resuser)
                  {
                    ngame.player1Name = resuser.User_name;
                    ngame.player1email = resuser.email;
                  }
                  resuser = await dbcnx.getUserById(m.P2_Id);
                  if (resuser)
                  {
                    ngame.player2Name = resuser.User_name;
                    ngame.player2email = resuser.email;
                  }
                  resuser = await dbcnx.getUserById(m.P3_Id);
                  if (resuser)
                  {
                    ngame.player3Name = resuser.User_name;
                    ngame.player3email = resuser.email;
                   }
                   resuser = await dbcnx.getUserById(m.P4_Id);
                   if (resuser)
                  {
                    ngame.player4Name = resuser.User_name;
                    ngame.player4email = resuser.email;
                  }
                  ngame.gameStatus = m.gameStatus;
                  // ngame.T_Id = m.T_Id;
                  // ngame.round = m.round;
                  ngame.count_players = m.count_players;
                  ngame.mode = m.mode;
                  matches.set(m.id, ngame);
                  await dbcnx.updateMatch(m);
                }
              }
              let ngame = new GameState();
              let resuser = await dbcnx.getUserById(m.P1_Id);
              if (resuser)
              {
                ngame.player1Name = resuser.User_name;
                ngame.player1email = resuser.email;
              }
              resuser = await dbcnx.getUserById(m.P2_Id);
              if (resuser)
              {
                ngame.player2Name = resuser.User_name;
                ngame.player2email = resuser.email;
              }
              resuser = await dbcnx.getUserById(m.P3_Id);
              if (resuser)
              {
                ngame.player3Name = resuser.User_name;
                ngame.player3email = resuser.email;
              }
              resuser = await dbcnx.getUserById(m.P4_Id);
              if (resuser)
              {
                ngame.player4Name = resuser.User_name;
                ngame.player4email = resuser.email;
              }
              ngame.id_Match = m.id;
              ngame.P1_Id = m.P1_Id;
              ngame.P2_Id = m.P2_Id;
              ngame.P3_Id = m.P3_Id;
              ngame.P4_Id = m.P4_Id;
              ngame.gameStatus = m.gameStatus;
              ngame.T_Id = m.T_Id;
              ngame.round = m.round;
              ngame.count_players = m.count_players;
              ngame.mode = m.mode;
              let data = JSON.stringify(ngame);
              sendtoplayer(ngame.P1_Id, data);
              sendtoplayer(ngame.P2_Id, data);
              sendtoplayer(ngame.P3_Id, data);
              sendtoplayer(ngame.P4_Id, data);
            }
            else
            {
              if (!matches.has(m.id)) 
                {
                  let ngame = new GameState();
                  ngame.id_Match = m.id;
                  ngame.P1_Id = m.P1_Id;
                  ngame.P2_Id = m.P2_Id;
                  ngame.P3_Id = m.P3_Id;
                  ngame.P4_Id = m.P4_Id;
                  let resuser = await dbcnx.getUserById(m.P1_Id);
                  if (resuser)
                  {
                    ngame.player1Name = resuser.User_name;
                    ngame.player1email = resuser.email;
                  }
                  resuser = await dbcnx.getUserById(m.P2_Id);
                  if (resuser)
                  {
                    ngame.player2Name = resuser.User_name;
                    ngame.player2email = resuser.email;
                   }
                   resuser = await dbcnx.getUserById(m.P3_Id);
                   if (resuser)
                  {
                    ngame.player3Name = resuser.User_name;
                    ngame.player3email = resuser.email;
                  }
                  resuser = await dbcnx.getUserById(m.P4_Id);
                  if (resuser)
                  {
                    ngame.player4Name = resuser.User_name;
                    ngame.player4email = resuser.email;
                  }
                  ngame.gameStatus = m.gameStatus;
                  ngame.T_Id = m.T_Id;
                  ngame.round = m.round;
                  ngame.count_players = m.count_players;
                  ngame.mode = m.mode;
                  ngame.Winner_Id = m.Winner_Id;
                  ngame.score1 = m.score1;
                  ngame.score2 = m.score2;
                  matches.set(m.id, ngame);
                  await dbcnx.updateMatch(m); 
              }
            }
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
               
                let resuser = await dbcnx.getUserById(m.P1_Id);
                //console.log("---3-----",resuser);
                if (resuser)
                {
                  m.player1Name = resuser.User_name;
                  m.player1email = resuser.email;
                }
           
                resuser = await dbcnx.getUserById(m.P2_Id);
                //console.log("---3-----",resuser);
                if (resuser)
                {
                  m.player2Name = resuser.User_name;
                  m.player2email = resuser.email;
                }
           
                resuser = await dbcnx.getUserById(m.P3_Id);
                //console.log("---3-----",resuser);
                if (resuser)
                {
                  m.player3Name = resuser.User_name;
                  m.player3email = resuser.email;
                }
           
                resuser = await dbcnx.getUserById(m.P4_Id);
                //console.log("---3-----",resuser);
                if (resuser)
                {
                  m.player4Name = resuser.User_name;  
                  m.player4email = resuser.email;
                }
                let tmp = matches.get(m.id);
                let data = JSON.stringify(tmp);
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
              // Tournament progression if applicable
              if (m.T_Id) {
                try {
                  
                  await advanceIfReady(m.T_Id);
                } catch (e) {
                  console.error("Tournament advance error:", e);
                }
              }
              matches.delete(m.id);
            }
            // else
            //  console.log("\n\n>>>>>getFinishedMatchByPlayerID not Found");
          }
          else if (request.type == "GET_TOURNAMENTS") {
            let t = await dbcnx.getAvailableTournaments();
            let data = JSON.stringify({ type: "TOURNAMENTS_LIST", tournaments: t });
            sendtoplayer(id, data);
            console.log("Sent tournaments list to player ", data);
          }
          else if (request.type == "DELETE") {
            await dbcnx.deletePendingMatchByPlayerID(id);
          }
        }
      else 
        console.log("⚠️ No token provided, proceeding without authentication");
  });

  const interval = setInterval(() => {
    if (clients.size == 0)
      return;
    for (const [id, match] of matches) {
      tick(match);
      let data = JSON.stringify(match);
      // console.log(data);
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

///ayoub/
// Register dashboard routes
import { registerDashboardRoutes_ayoub } from "./dashboard_ayoub.js";
import { match } from "assert";
await registerDashboardRoutes_ayoub(fastify, dbcnx);
// console.log("Dashboard routes registered!");

// Register tournament routes
await registerTournamentRoutes(fastify, dbcnx);
// console.log("Tournament routes registered!");

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
fastify.listen({ port: PORT, host: "0.0.0.0" });
