import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fjwt from "@fastify/jwt";  
import websocket from "@fastify/websocket";
import cors from "@fastify/cors";
const fastify = Fastify({ logger: false });

await fastify.register(websocket);
await fastify.register(cors, {
  origin: true,
  credentials: true
});
import { Users, Match, SQLiteDB, GameState } from "./DBController.js";

let dbcnx = new SQLiteDB();
let clients = new Map();
let matches = new Map();
const TICK_RATE = 60;
const PADDLE_SPEED = 8;
const MAX_Speed = 25;
const MAX_Score = 5;
await dbcnx.connect();

function sendtoplayer(id, data) {
  if (id) {
    let socket = (clients.get(id));
    if (socket && socket.readyState === 1)
      socket.send(data);
    }
}

function moveplayer(m,y,up,down,id,dt)
{
  if (!id) return null;
  if (up)
    y = Math.max(0, y - (PADDLE_SPEED * dt));
  else if (down)
    y = Math.min(m.height - m.sizePaddle_height, y + (PADDLE_SPEED * dt));
  return y;
}

function playercoli(m,x,y,id, n,dt)
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
         if (m.Ball_dx * m.Ball_dx + m.Ball_dy * m.Ball_dy < MAX_Speed * MAX_Speed) {
           m.Ball_dx *= 1.2;
           m.Ball_dy *= 1.2;
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
         if (m.Ball_dx * m.Ball_dx + m.Ball_dy * m.Ball_dy < MAX_Speed * MAX_Speed) {
          m.Ball_dx *= 1.2;
          m.Ball_dy *= 1.2;
    }
    }
  }
}

function tick(m,dt) {
  if (m.gameStatus !== "PLAYING") return;

  m.Player1_y = moveplayer(m, m.Player1_y, m.p1UPkey, m.p1Downkey, m.P1_Id,dt);
  m.Player2_y = moveplayer(m, m.Player2_y, m.p2UPkey, m.p2Downkey, m.P2_Id,dt);
  m.Player3_y = moveplayer(m, m.Player3_y, m.p3UPkey, m.p3Downkey, m.P3_Id,dt);
  m.Player4_y = moveplayer(m, m.Player4_y, m.p4UPkey, m.p4Downkey, m.P4_Id,dt);
  m.Ball_x += m.Ball_dx*dt;
  m.Ball_y += m.Ball_dy*dt;

  if (m.Ball_y - m.ball_radius <= 0 || m.Ball_y + m.ball_radius >= m.height) {
    m.Ball_dy *= -1;
    m.Ball_y = Math.max(m.ball_radius, Math.min(m.height - m.ball_radius, m.Ball_y));
  }

  playercoli(m, m.Player1_x, m.Player1_y, m.P1_Id,1,dt);
  playercoli(m, m.Player3_x, m.Player3_y, m.P3_Id,1,dt);
  playercoli(m, m.Player2_x, m.Player2_y, m.P2_Id,0,dt);
  playercoli(m, m.Player4_x, m.Player4_y, m.P4_Id,0,dt);

  if (m.Ball_x < 0) {
    m.score2 += 1;
    resetBall(-1, m);
  } else if (m.Ball_x > m.width) {
    m.score1 += 1;
    resetBall(1, m);
  }
  if (m.score2 == MAX_Score || m.score1 == MAX_Score)
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

fastify.addHook("preHandler", (req, _res, next) => {
  req.jwt = fastify.jwt;
  next();
});

fastify.register(fastifyCookie, {
  secret: process.env.JWT_ACCESS_SECRET,
  hook: "preHandler",
});

fastify.get('/', async (request, reply) => {
  return { message: 'Server is running' };
});

const interval = setInterval(() => {
  if (clients.size == 0 || matches.size == 0)
    return;
  for (const [id, match] of matches) {
    match.now = Date.now();
    let delta = (((match.now - match.last)) * TICK_RATE) / 1000;
    match.last = match.now;
    tick(match,delta);
    let data = JSON.stringify(match);
    sendtoplayer(match.P1_Id, data);
    sendtoplayer(match.P2_Id, data);
    sendtoplayer(match.P3_Id, data);
    sendtoplayer(match.P4_Id, data);
  }
}, 1000 / TICK_RATE);


fastify.get("/ws", { websocket: true }, async (connection, req) => {
  connection.on("message", async (msg) => {
      const request = JSON.parse(msg);
      const token = request.token;
      console.log("This is server.js >> ",request.type);
      if (token) {
          const decoded = req.jwt.verify(token);
          const id = decoded.id;
          const email = decoded.email;
          const name = decoded.name;
          if (clients.has(id)) {
            try {
              if (clients.get(id) != connection) {
                // clients.get(id).close();
                console.log("Server Closed Duplicate Socket for ",id);
              }
            }
            catch (e) {
            }
          }
          clients.set(id, connection);
        let ngame = new GameState();
        if (request.type == "REGISTER") 
        {
          let u = new Users();
          u.id = id; 
          u.email = email;
          u.User_name = name;
          u.isOnline = true;
          u.Auto_Match = true;
          await dbcnx.createUsers(u);
          let m = await dbcnx.getOngoingMatch(id);
            // console.log("getOngoingMatch :" , m);
          if (!m) 
          {
            m = await dbcnx.getOpenRoom(request.mode);
              // console.log("getOpenRoom :" , m);
            if (!m) {
              m = new Match();
              m.P1_Id = id;
              m.player1Name = name;
              m.mode = request.mode;
              if (!request.tournement) {
                m.id = await dbcnx.createMatch_not(m);
                 //  console.log("createMatch_not :" , m.id);
              }
              else {
                m.id = await dbcnx.createMatch(m);
                // console.log("createMatch_not :" , m.id);
              }
            }
            else 
            {
              if (request.mode == 2) 
               {
                if (m.P1_Id == null) 
                  m.P1_Id = id;
                else
                  m.P2_Id = id;
               }
              else
              {
                if (m.P1_Id == null) 
                  m.P1_Id = id;
                else if (m.P2_Id == null) 
                  m.P2_Id = id;
                else if (m.P3_Id == null) 
                  m.P3_Id = id;
                else 
                  m.P4_Id = id;
              }
                m.count_players = m.count_players + 1;
            }
            ngame.id = m.id;
            ngame.P1_Id = m.P1_Id;
            ngame.P2_Id = m.P2_Id;
            ngame.P3_Id = m.P3_Id;
            ngame.P4_Id = m.P4_Id;
            let resuser = await dbcnx.getUser(m.P1_Id);
            if (resuser)
            {
                ngame.player1Name = resuser.User_name;
                ngame.player1Email = resuser.email;
            }
            resuser = await dbcnx.getUser(m.P2_Id);
            if (resuser)
            {
              ngame.player2Name = resuser.User_name;
              ngame.player2Email = resuser.email;
            }
            resuser = await dbcnx.getUser(m.P3_Id);
            if (resuser)
            {
              ngame.player3Name = resuser.User_name;
              ngame.player3Email = resuser.email;
            }
            resuser = await dbcnx.getUser(m.P4_Id);
            if (resuser)
            {
              ngame.player4Name = resuser.User_name;
              ngame.player4Email = resuser.email;
            }
            ngame.T_Id = m.T_Id;
            ngame.count_players = m.count_players;
            ngame.mode = request.mode;
            ngame.id = m.id;
            if (ngame.count_players == request.mode) 
            {
                m.gameStatus = "PLAYING";
                if(!matches.get(m.id))
                  matches.set(m.id, ngame);
            }
            ngame.gameStatus = m.gameStatus;
            let data = JSON.stringify(ngame);
            await dbcnx.updateMatch(m);
            // console.log("Server will sends", ngame);
            // if(!matches.get(m.id))
            //   matches.set(m.id, ngame);
            sendtoplayer(ngame.P1_Id, data);
            sendtoplayer(ngame.P2_Id, data);
            sendtoplayer(ngame.P3_Id, data);
            sendtoplayer(ngame.P4_Id, data);
          }
          else
          {
            ngame = matches.get(m.id);
            if (ngame)
            {
              let data = JSON.stringify(ngame);
              sendtoplayer(ngame.P1_Id, data);
              sendtoplayer(ngame.P2_Id, data);
              sendtoplayer(ngame.P3_Id, data);
              sendtoplayer(ngame.P4_Id, data);
            }
            else
            {
              console.log("Cant find m.id_Match == ",m.id)
            }

          }
        }
        else if (request.type == "MOVE") {
            let match = matches.get(request.matchId);
            // console.log("id match === ",match);
            if(match)
            {
              if (match.P1_Id == id) {
                match.p1UPkey = request.keys.ArrowUp;
                match.p1Downkey = request.keys.ArrowDown;
              }
              else if (match.P2_Id == id) {
                match.p2UPkey = request.keys.ArrowUp;
                match.p2Downkey = request.keys.ArrowDown;
              }
              else if (match.P3_Id && match.P3_Id == id) {
                match.p3UPkey = request.keys.ArrowUp;
                match.p3Downkey = request.keys.ArrowDown;
              }
              else if (match.P4_Id && match.P4_Id == id) {
                match.p4UPkey = request.keys.ArrowUp;
                match.p4Downkey = request.keys.ArrowDown;
              }
            }
            
        }
          else if (request.type == "FINISHED") {
          let m = matches.get(request.matchId);
          // console.log("request.matchId ===",request.matchId,"m.id === ",m.id); 
          if (m) 
          {
            m.id = request.matchId;
            m.id_Match = request.id_Match;
            if (m.score1 >= m.score2)
              m.Winner_Id = m.P1_Id;
            else
              m.Winner_Id = m.P2_Id;
            m.gameStatus = "FINISHED";
            await dbcnx.updateMatch(m);
            // console.log("Before :",matches.size);
            matches.delete(m.id);
            // console.log("After :",matches.size);
          }
        }
        else if (request.type == "DELETE") {
          await dbcnx.deleteMatch(request.matchId);
        }
        }
        // else if(request.type == "ROOM_STATE" )
        // {
        //   let m = matches.get(request.matchId);
        //   if(m)
        //   {
        //     m.id = request.matchId;
        //     let data = JSON.stringify(m);
        //     sendtoplayer(m.P1_Id, data);
        //     sendtoplayer(m.P2_Id, data);
        //     sendtoplayer(m.P3_Id, data);
        //     sendtoplayer(m.P4_Id, data);
        //   }
        //   else
        //   {
        //     console.log("<<<<<<<request.matchId >>> ",request.matchId," Found :: ",m)
        //   }

        // }
      else 
        console.log("No token provided, proceeding without authentication");
  });
  connection.on("close", () => {
    for (const [id, client] of clients) {
      if (client == connection) {
        clients.delete(id);
        console.log("Server OnClosed Socket for ",id);
        break;
      }
    }
  });
});


import { registerDashboardRoutes_ayoub } from "./dashboard_ayoub.js";
await registerDashboardRoutes_ayoub(fastify, dbcnx);
console.log("Dashboard routes registered!");

fastify.listen({ port: 3000, host: "0.0.0.0" });
