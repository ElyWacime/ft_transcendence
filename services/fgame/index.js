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
  origin: ['http://10.12.7.4'],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
});
//ayoub//
import { Users, Match, SQLiteDB, GameState, Tournament } from "./DBController.js";
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

async function advanceIfReady(tId) {
  const winners = await dbcnx.getwinnerIDs(tId);
  if (!winners || winners.length < 2) {
    console.log("Winners not found or not enough winners:", winners);
    return;
  }
  else
  {
    console.log("Winners found:", winners);
  }
  // Ensure both winners have valid IDs
  if (!winners[0].id || !winners[1].id) {
    console.log("Waiting for all winners to be decided...", winners);
    return;
  }

  console.log("Winners ready:", winners);
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

// async function advanceIfReady(tId, maxRetries = 3, delayMs = 10000) {
//   console.log("Checking winners for tournament:", tId);
  
//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     console.log(`Attempt ${attempt}/${maxRetries} - waiting ${delayMs/1000}s...`);
    
//     // Wait before checking (except on first attempt)
//     if (attempt > 1) {
//       await new Promise(resolve => setTimeout(resolve, delayMs));
//     }
    
//     try {
//       const winners = await dbcnx.getwinnerIDs(tId);
      
//       // Check if winners array exists and has enough elements
//       if (winners && Array.isArray(winners) && winners.length >= 2) {
//         const validWinners = winners.slice(0, 2);
        
//         // Check if winners have valid IDs
//         if (validWinners.every(w => w && w.id)) {
//           console.log("Winners ready on attempt", attempt);
//           return await createAndNotifyMatch(tId, validWinners);
//         }
//       }
      
//       console.log(`Attempt ${attempt}: Winners not ready yet`);
      
//     } catch (error) {
//       console.error(`Attempt ${attempt} failed:`, error);
//     }
//   }
  
//   console.log(`Failed to get winners after ${maxRetries} attempts`);
//   return null;
// }

// async function createAndNotifyMatch(tId, winners) {
//   console.log("Creating match with winners:", winners);
  
//   const m = new Match();
//   m.round = 2;
//   m.T_Id = tId;
//   m.P1_Id = winners[0].id;
//   m.P2_Id = winners[1].id;
//   m.count_players = 2;
//   m.gameStatus = "PLAYING";
  
//   const matchId = await this.db.createMatch(m);
//   m.id = matchId;
//   await this.db.updateMatch(m);
  
//   console.log("Match created with ID:", matchId);
  
//   // Notify players
//   // notifyPlayers(m.P1_Id, m.P2_Id, tId);
//     let socket = clients.get(m.P1_Id);
//     if (socket && socket.readyState === 1)
//       socket.send(JSON.stringify({ type: 'redirect', tournamentId: tId }));
//     else
//       console.log("No socket for player ", m.P1_Id);
//     socket = clients.get(m.P2_Id);
//     if (socket && socket.readyState === 1)
//       socket.send(JSON.stringify({ type: 'redirect', tournamentId: tId }));
//     else
//       console.log("No socket for player ", m.P2_Id);
//   return m;
// }

fastify.get("/ws", { websocket: true }, async (connection, req) => {
  connection.on("message", async (msg) => {
    // try {
      const request = JSON.parse(msg);
      const token = request.token;
      console.log("request.type === ", request.type);
      if (token) {
          const decoded = req.jwt.verify(token);
          const id = decoded.id;
          const email = decoded.email;
          const name = decoded.name;
          let u = new Users();
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
          else
          {
            u.id = id;
            u.email = email;
            u.User_name = name;
            u.isOnline = true;
            u.Auto_Match = true;
            await dbcnx.createUsers(u);
          }
          u = await dbcnx.getUserById(id);
          clients.set(id, connection);
          if (request.type == "REGISTER") {
            let m = await dbcnx.getOngoingMatchByPlayerID(id);
            if (!m) {
              m = await dbcnx.getMatchPlayerCanJoin(request.mode);
              if (!m) {
                m = new Match();
                m.P1_Id = id;
                let resuser = await dbcnx.getUserById(id);
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
                  m.P2_Id = id;
                  let resuser = await dbcnx.getUserById(id);
                  m.player2Name = resuser.User_name;
                  m.count_players = m.count_players + 1;
                }
                else {
                  if (m.P2_Id == null) {
                    m.P2_Id = id;
                
                    let resuser = await dbcnx.getUserById(id);
                    
                    m.player2Name = resuser.User_name;
                    m.count_players = m.count_players + 1;
                  }
                  else if (m.P3_Id == null) {
                    m.P3_Id = id;
                
                    let resuser = await dbcnx.getUserById(id);
                    
                    m.player3Name = resuser.User_name;
                    m.count_players = m.count_players + 1;
                  }
                  else if (m.P4_Id == null) {
                    m.P4_Id = id;
                
                    let resuser = await dbcnx.getUserById(id);
                    
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
              const [usr1, usr2, usr3, usr4] = await Promise.all([
                dbcnx.getUserById(m.P1_Id),
                dbcnx.getUserById(m.P2_Id),
                dbcnx.getUserById(m.P3_Id),
                dbcnx.getUserById(m.P4_Id)
            ])
              if (usr1)
              {
                ngame.player1Name = usr1.User_name;
                ngame.player1email = usr1.email;
              }
              if (usr2)
              {
                ngame.player2Name = usr2.User_name;
                ngame.player2email = usr2.email;
              }
              if (usr3)
              {
                ngame.player3Name = usr3.User_name;
                ngame.player3email = usr3.email;
              }
              if (usr4)
              {
                ngame.player4Name = usr4.User_name;
                ngame.player4email = usr4.email;
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
            // request.idm =
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
            let m = await dbcnx.getMatchById(id);
            if (m) {
              let tmp = matches.get(request.id_match);
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
              await dbcnx.updateMatch(m);
              // Tournament progression if applicable
              console.log("\n\n>>>>>m.T_Id ===  ",m.T_Id, "m ==== ",m);
              if (m.T_Id) {
                // try {
                //   console.log("\n\n>>>>>advanceIfReady: ");
                  await advanceIfReady(m.T_Id);
                // } catch (e) {
                //   console.error("Tournament advance error:", e);
                // }
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
          else if (request.type == "CREATE_TOURNAMENT") {
            let tour = new Tournament();
            tour.label = request.label;
            await dbcnx.createTournament(tour);
            let t = await dbcnx.getAvailableTournaments();
            let data = JSON.stringify({ type: "TOURNAMENTS_LIST", tournaments: t });
            sendtoplayer(id, data);
            console.log("Sent tournaments list to player ", data);
          }
          else if (request.type == "JOIN_TOURNAMENT") {
            // console.log("Player ", id, " joining tournament ", request.tournamentId);
            await dbcnx.createParticipate(id, request.tournamentId);
            let t = await dbcnx.getAvailableTournaments();
            let data = JSON.stringify({ type: "TOURNAMENTS_LIST", tournaments: t });
            sendtoplayer(id, data);
            console.log("Sent tournaments list to player ", data);
          }
          else if (request.type == "START_TOURNAMENT") {
            const participants =  await dbcnx.getParticipantsByTournamentId(request.tournamentId);
            console.log("\n\nrequest.tournamentId   ",request.tournamentId);
            await dbcnx.updateTournamentstatus(request.tournamentId, 'PLAYING');
            let m = new Match();
            m.round = 1;
            m.T_Id = request.tournamentId;
            m.P1_Id = participants[0].id;
            m.P2_Id = participants[1].id;
            m.count_players = 2;
            m.gameStatus = "PLAYING";
            // console.log("\n\nCreating Match for ", m);
            let matchId = await dbcnx.createMatch(m);
            // console.log("\n\ncreateMatch");
            m.id = matchId;
            await dbcnx.updateMatch(m);
            // console.log("\n\nupdateMatch");
            let socket = clients.get(m.P1_Id);
            if (socket && socket.readyState === 1)
              socket.send(JSON.stringify({ type: 'redirect', tournamentId: request.tournamentId }));
            else
              console.log("No socket for player ", m.P1_Id);
            socket = clients.get(m.P2_Id);
            if (socket && socket.readyState === 1)
              socket.send(JSON.stringify({ type: 'redirect', tournamentId: request.tournamentId }));
            else
              console.log("No socket for player ", m.P2_Id);
            m = new Match();
            m.round = 1;
            m.T_Id = request.tournamentId;
            m.P1_Id = participants[2].id;
            m.P2_Id = participants[3].id;
            m.count_players = 2;
            m.gameStatus = "PLAYING";
            // console.log("\n\nCreating Match for2 ", m);
            matchId = await dbcnx.createMatch(m);
            // console.log("\n\ncreateMatch2");
            m.id = matchId;
            await dbcnx.updateMatch(m);
            // console.log("\n\nupdateMatch2");
            socket = clients.get(m.P1_Id);
            if (socket && socket.readyState === 1)
              socket.send(JSON.stringify({ type: 'redirect', tournamentId: request.tournamentId }));
            else
              console.log("No socket for player ", m.P1_Id);
            socket = clients.get(m.P2_Id);
            if (socket && socket.readyState === 1)
              socket.send(JSON.stringify({ type: 'redirect', tournamentId: request.tournamentId }));
            else
              console.log("No socket for player ", m.P2_Id);
            // await this.advanceIfReady(tId);
            // console.log("\n\nadvanceIfReady");
          }
          else if (request.type == "DELETE") {
            // await dbcnx.deletePendingMatchByPlayerID(id);
          }
        }
      else 
        console.log("⚠️ No token provided, proceeding without authentication");
    // }
    // catch (e) {
    //   console.log("⚠️ Error processing message:", e);
    // }

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
import { clear } from "console";
await registerDashboardRoutes_ayoub(fastify, dbcnx);
// console.log("Dashboard routes registered!");

// Register tournament routes
await registerTournamentRoutes(fastify, dbcnx);
// console.log("Tournament routes registered!");

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
fastify.listen({ port: PORT, host: "0.0.0.0" });
