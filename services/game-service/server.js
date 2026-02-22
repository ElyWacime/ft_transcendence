import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fjwt from "@fastify/jwt";  
import websocket from "@fastify/websocket";
import cors from "@fastify/cors";
import { Users, Match, SQLiteDB, GameState } from "./DBController.js";


const fastify = Fastify({ logger: false });

await fastify.register(websocket);

await fastify.register(cors, {
  origin: true,
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","Origin","X-Requested-With","Accept","Cookie"],
});

let dbcnx = new SQLiteDB();
let clients = new Map();
let clients_info = new Map();
let matches = new Map();
const TICK_RATE = 60;
const PADDLE_SPEED = 8;
const MAX_Speed = 25;
const MAX_Score = 5;

await dbcnx.connect();


const sendtoplayer = async (id, data) => {
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
  if (m.score2 >= MAX_Score || m.score1 >= MAX_Score)
  {
    m.gameStatus = "FINISHED";
    m.Winner_Id = m.P2_Id;
    if (m.score1 >= m.score2)
    m.Winner_Id = m.P1_Id;
    dbcnx.updateMatch(m);
    matches.delete(m.id);
  }
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

const handelRoomQuiiting = async(id) => {
  let m = await dbcnx.deletePendingMatchByPlayerID(id);
  if (m)
  {
    let ngame = new GameState();
    ngame.id = m.id;
    ngame.P1_Id = m.P1_Id;
    ngame.P2_Id = m.P2_Id;
    ngame.P3_Id = m.P3_Id;
    ngame.P4_Id = m.P4_Id;
    ngame.T_Id = m.T_Id;
    ngame.count_players = m.count_players;
    ngame.mode = m.mode;
    ngame.id = m.id;
    ngame.gameStatus = m.gameStatus;

    let [name1,name2,name3,name4] = await Promise.all([route(m.P1_Id),route(m.P2_Id),route(m.P3_Id),route(m.P4_Id)]);
    ngame.player1Name = name1;
    ngame.player2Name = name2;
    ngame.player3Name = name3;
    ngame.player4Name = name4;

  if (!ngame.player1Name && (ngame.P1_Id != id))
    ngame.player1Name = clients_info.get(ngame.P1_Id);
  if (!ngame.player2Name && (ngame.P2_Id != id))
    ngame.player2Name = clients_info.get(ngame.P2_Id);
  if (!ngame.player3Name && (ngame.P3_Id != id))
    ngame.player3Name = clients_info.get(ngame.P3_Id);
  if (!ngame.player4Name && (ngame.P4_Id != id))
    ngame.player4Name = clients_info.get(ngame.P4_Id);

  let data = JSON.stringify(ngame);
  sendtoplayer(ngame.P1_Id, data);
  sendtoplayer(ngame.P2_Id, data);
  sendtoplayer(ngame.P3_Id, data);
  sendtoplayer(ngame.P4_Id, data);
  }
  else
    console.log("coudnt find this match :: ",id);

};

const handelRegister = async(request,id,email,name) => {
  let u = new Users();
  let ngame = new GameState();
  u.id = id; 
  u.email = email;
  u.User_name = await route(id);
  clients_info.set(id, u.User_name);
  if (!u.User_name)
  {
    u.User_name = id;
    clients_info.set(id, null);
  }
  u.isOnline = true;
  u.Auto_Match = true;
  await dbcnx.createUsers(u);
  let m = await dbcnx.getOngoingMatch(id);
  if (!m) 
  {
    m = await dbcnx.getOpenRoom(request.mode);
    if (!m) {
      m = new Match();
      m.P1_Id = id;
      m.mode = request.mode;
      if (!request.tournement) {
        m.id = await dbcnx.createMatch_not(m);
      }
      else {
        m.id = await dbcnx.createMatch(m);
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
  }
  ngame.id = m.id;
  ngame.P1_Id = m.P1_Id;
  ngame.P2_Id = m.P2_Id;
  ngame.P3_Id = m.P3_Id;
  ngame.P4_Id = m.P4_Id;
  let [name1,name2,name3,name4] = await Promise.all([route(m.P1_Id),route(m.P2_Id),route(m.P3_Id),route(m.P4_Id)]);
  ngame.player1Name = name1;
  ngame.player2Name = name2;
  ngame.player3Name = name3;
  ngame.player4Name = name4;

  // if ( ngame.P1_Id == id)
  //   ngame.player1Name = u.User_name;
  // if ( ngame.P2_Id == id)
  //   ngame.player2Name = u.User_name;
  // if ( ngame.P3_Id == id)
  //   ngame.player3Name = u.User_name;
  // if ( ngame.P4_Id == id)
  //   ngame.player4Name = u.User_name;

  if (!ngame.player1Name)
    ngame.player1Name = clients_info.get(ngame.P1_Id);
  if (!ngame.player2Name)
    ngame.player2Name = clients_info.get(ngame.P2_Id);
  if (!ngame.player3Name)
    ngame.player3Name = clients_info.get(ngame.P3_Id);
  if (!ngame.player4Name)
    ngame.player4Name = clients_info.get(ngame.P4_Id);

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
  // console.log("Server wiill send ::: ",ngame);
  sendtoplayer(ngame.P1_Id, data);
  sendtoplayer(ngame.P2_Id, data);
  sendtoplayer(ngame.P3_Id, data);
  sendtoplayer(ngame.P4_Id, data);
};

const handelMove = async (request,id) =>{
  let match = matches.get(request.matchId);
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
};

const handelFinish = async (ID) =>  {
  let m = matches.get(ID);
  if (m) 
  {
    m.id = ID;
    m.id_Match = ID;
    if (m.score1 >= m.score2)
      m.Winner_Id = m.P1_Id;
    else
      m.Winner_Id = m.P2_Id;
    m.gameStatus = "FINISHED";
    await dbcnx.updateMatch(m);
    matches.delete(m.id);
  }
  else
    console.log("Couldnt end request.matchId ",ID);
};

const handelDup = async (connection,id) => {
  if (clients.has(id)) 
  {
    try {
      if (clients.get(id) != connection) 
      {
        clients.get(id).close();
        console.log("Server Closed Duplicate Socket for ",id);
      }
    }
    catch (e) 
    {  
      console.log("Error Server Closed Duplicate Socket for ",id);
    }
  }
};

const interval = setInterval(async () => {
  if (matches.size == 0)
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

const route = async (id) => {
  try {
    if(!id)
      return null;
    const response = await fetch(`http://auth-service:8000/get-user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      console.error(`Auth service returned status ${response.status}`);
      return null;
    }
    const user = await response.json();
    return user ? user.name : null;
  } catch (error) {
    console.error(`Error fetching user ${id} from auth service: `,error);
    return null;
  }
};

fastify.get("/ws", { websocket: true }, async (connection, req) => {
  connection.on("message", async (msg) => {
   try
   {
      const request = JSON.parse(msg);
      let token = request.token;
      console.log("<<<<<<<< <<<<<<<< This is server.js  >>>>>>>>>>>>",request.type);
      if (token) {
          const decoded = req.jwt.verify(token);
          const id = decoded.id;
          const email = decoded.email;
          const name = decoded.name;
          await handelDup(connection,id);
          clients.set(id, connection);
          if (request.type == "REGISTER") 
            await handelRegister(request,id,email,name);
          else if (request.type == "MOVE") 
            await handelMove(request,id);
          else if (request.type == "FINISHED") 
            await  handelFinish(request.matchId) ;
          else if (request.type == "DELETE") 
            await handelRoomQuiiting(id);
        }
      else 
        console.log("No token provided, proceeding without authentication");
   }
   catch (e)
   {
      console.log("Error :",e);
   }
  });
  connection.on("close", async () => {
    for (const [id, client] of clients) {
      if (client == connection) {
       try {
        await handelRoomQuiiting(id);
        clients.delete(id);
        console.log("Server OnClosed Socket for ",id);
        break;
       } catch (e) {
        return reply.code(404).send({ message: e });
       }
      }
    }
  });
});

fastify.post('/invite', async (request, reply) => {
  try {
    let token = request.body.token;
    if (!token)
      return reply.code(403).send({ message: 'Not Log in' });
    let P1 = request.body.P1;
    let P2 = request.body.P2;
    let [name1, name2, m1, m2]= await Promise.all([ route(P1), route(P2), dbcnx.getAvaiable(P1), dbcnx.getAvaiable(P2)]);
    if (!(m1 || m2))
    {
      let u = new Users();
      u.id = P1; 
      u.User_name = name1;
      u.email = P1; 
      await dbcnx.createUsers(u);
      clients_info.set(P1,name1);

      u = new Users();
      u.id = P2; 
      u.User_name = name2;
      u.email = P2; 
      await dbcnx.createUsers(u);
      clients_info.set(P2,name2);

      let m = new Match();
      m.P1_Id = P1;
      m.P2_Id = P2;
      m.count_players = 2;
      await  dbcnx.createVIPMatch(m);
      return reply.code(201).send(JSON.stringify({ message: 'You Can Navigate' }));
    }
    return reply.code(409).send(JSON.stringify({ message: 'You Cant Navigate' }));
  } catch (e) {
    return reply.code(405).send({ message: 'Error ' + e });
  }
});

fastify.post('/tournament', async (request, reply) => {
  try 
  {
    let token = request.body.token;
    if (!token)
      return reply.code(403).send({ message: 'Not Log in' });
    const decoded = request.jwt.verify(token);
    const id = decoded.id;
    let P1 = request.body.P1;
    let P2 = request.body.P2;
    let tournement = request.body.tournement;
    let m1 = await dbcnx.getAvaiable(P1);
    let m2 = await dbcnx.getAvaiable(P2);
    let m = null;
    if (!(m1 || m2))
    {
      let u = new Users();
      let res = await dbcnx.getUser(P1);
      if (!res)
      {
        u.id = P1; 
        u.User_name = await route(P1); 
        u.email = P1; 
        await dbcnx.insertUser(u);
      }
      res = await dbcnx.getUser(P2);
      if (!res)
      {
        u = new Users();
        u.id = P2; 
        u.User_name = await route(P2); 
        u.email = P2; 
        await dbcnx.insertUser(u);
      }
      m = new Match();
      m.P1_Id = P1;
      m.P2_Id = P2;
      m.T_Id = tournement;
      m.count_players = 2;
      await  dbcnx.createVIPMatch(m);
      return reply.code(201).send(JSON.stringify({ message: 'You Can Navigate' }));
    }
    return reply.code(409).send(JSON.stringify({ message: 'You Cant Navigate' }));
  } 
  catch (e) 
  {
    return reply.code(404).send({ message: e });
  }
});

fastify.post('/check', async (request, reply) => {
  try {
    let token = request.body.token;
    if (!token)
      return reply.code(403).send({ message: 'Not Log in' });
    const decoded = request.jwt.verify(token);
    const id = decoded.id;
    let m = await dbcnx.getAvaiable(id);
  
    if (m && m.mode != request.body.mode)
    {
      return reply.code(409).send({ message: 'Not Available' });
    }
    return reply.code(201).send({ message: 'Available' });
  } catch (e) {
    return reply.code(405).send({ message: e });
  }
});

fastify.post('/endmatch', async (request, reply) => {
  try {
    let token = request.body.token;
    if (!token)
      return reply.code(403).send({ message: 'Not Log in' });
    const decoded = request.jwt.verify(token);
    const id = decoded.id;
    let m = await dbcnx.getcurrentmatch(id);
    if (m)
    {
      let ngame =  matches.get(m.id);
      ngame.score1 = 5;
      ngame.score2 = 0;
      ngame.Winner_Id = ngame.P1_Id;
      if (ngame.P1_Id == id || ngame.P3_Id == id)
      {
        ngame.score1 = 0;
        ngame.score2 = 5;
        ngame.Winner_Id = ngame.P2_Id;
      }
    }
    return reply.code(201).send({ message: 'Good' });
  } catch (e) {
      return reply.code(405).send({ message: e });
  }
});


fastify.post('/allmatch', async (request, reply) => {
  try {
    let matches = await dbcnx.getPlayerMatches(request.body.id);
    if (matches) {
      matches = await Promise.all(matches.map(async (m) => {
        const [P1, P2, P3, P4, Winner] = await Promise.all([
          route(m.P1_Id),
          route(m.P2_Id),
          route(m.P3_Id),
          route(m.P4_Id),
          route(m.Winner_Id),
        ]);
        return { ...m, Name1: P1, Name2: P2, Name3: P3, Name4: P4, NameW: Winner };
      }));
    }

    return reply.code(201).send({ matches });
  } 
  catch (e) {
    return reply.code(500).send({ message: e.toString() });
  }
});

import { registerDashboardRoutes_ayoub } from "./dashboard_ayoub.js";
import { userInfo } from "os";
await registerDashboardRoutes_ayoub(fastify, dbcnx);
fastify.listen({ port: 3000, host: "0.0.0.0" });
