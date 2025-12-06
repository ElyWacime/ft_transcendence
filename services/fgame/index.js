import Fastify from "fastify";

import websocket from "@fastify/websocket";

const fastify = Fastify({ logger: false });

await fastify.register(websocket);
import { Users, Match, SQLiteDB, GameState } from "./DBController.js";
import { exit } from "process";


let dbcnx = new SQLiteDB();
await dbcnx.connect();
// let indx = await dbcnx.getUserss();
// console.log(indx);

// let gameState = {
//   ball: { x: 400, y: 300, dx: 2, dy: 2, radius: 8 },
//   paddle1: { x: 20, y: 250 },
//   paddle2: { x: 765, y: 250 },
//   paddle3: { x: 60, y: 250 },
//   paddle4: { x: 725, y: 250 },
//   width: 800,
//   height: 600,
//   score1: 0,
//   score2: 0,
//   sizePaddle: { width: 15, height: 100 },
//   player1Name: "",
//   player2Name: "",
//   gameStatus: "waiting",
//   count: 0,
//   p1keys: { ArrowUp: false, ArrowDown: false },
//   p2keys: { ArrowUp: false, ArrowDown: false }
// };

// const email1 = "www@www.w";
// const email2 = "qqqw@qqqw.q";
// const clients = new Set();
// const PADDLE_SPEED = 8;

const TICK_RATE = 60;
const clients = new Map();

function tick() {
  if (m.gameStatus !== "PLAYING") return;
  m.ball.x += m.ball.dx;
  m.ball.y += m.ball.dy;
  if (m.ball.y - m.ball.radius <= 0 || m.ball.y + m.ball.radius >= m.height) {
    m.ball.dy *= -1;
    m.ball.y = Math.max(m.ball.radius, Math.min(m.height - m.ball.radius, m.ball.y));
  }
  if (m.ball.x - m.ball.radius <= m.paddle1.x + m.sizePaddle.width) {
    if (m.ball.y >= m.paddle1.y && m.ball.y <= m.paddle1.y + m.sizePaddle.height) {
      m.ball.dx = Math.abs(m.ball.dx);
      m.ball.dx *= 1.05;
    }
  }
  if (m.ball.x + m.ball.radius >= m.paddle2.x) {
    if (m.ball.y >= m.paddle2.y && m.ball.y <= m.paddle2.y + m.sizePaddle.height) {
      m.ball.dx = -Math.abs(m.ball.dx);
      m.ball.dx *= 1.05;
    }
  }
  if (m.p1keys.ArrowUp)
    m.paddle1.y = Math.max(0, m.paddle1.y - PADDLE_SPEED);
  else if (m.p1keys.ArrowDown)
    m.paddle1.y = Math.min(m.height - m.sizePaddle.height, m.paddle1.y + PADDLE_SPEED);
  if (m.p2keys.ArrowUp)
    m.paddle2.y = Math.max(0, m.paddle2.y - PADDLE_SPEED);
  else if (m.p2keys.ArrowDown)
    m.paddle2.y = Math.min(m.height - m.sizePaddle.height, m.paddle2.y + PADDLE_SPEED);
  if (m.ball.x < 0) {
    m.score2 += 1;
    resetBall(-1);
  } else if (m.ball.x > m.width) {
    m.score1 += 1;
    resetBall(1);
  }
  if (m.score2 == 5 || m.score1 == 5)
    m.gameStatus = "finished";
}

function resetBall(direction = 1) {
  gameState.ball.x = gameState.width / 2;
  gameState.ball.y = gameState.height / 2;
  gameState.ball.dx = 2 * direction;
  gameState.ball.dy = 2;
}

fastify.get('/', async (request, reply) => {
  return { message: 'Server is running' };
});

let game = new GameState();
const matches = new Map();
// let gameState = {
//   ball: { x: 400, y: 300, dx: 2, dy: 2, radius: 8 },
//   paddle1: { x: 20, y: 250 },
//   paddle2: { x: 765, y: 250 },
//   paddle3: { x: 60, y: 250 },
//   paddle4: { x: 725, y: 250 },
//   width: 800,
//   height: 600,
//   score1: 0,
//   score2: 0,
//   sizePaddle: { width: 15, height: 100 },
//   player1Name: "",
//   player2Name: "",
//   gameStatus: "PLAYING",
//   count: 2,
//   p1keys: { ArrowUp: false, ArrowDown: false },
//   p2keys: { ArrowUp: false, ArrowDown: false }
// };
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
    console.log("Total clients : ", clients.size);
    console.log("request.type === ", request.type);

    if (request.type == "REGISTER") {
      let u = new Users();
      u.id = request.id; //to add in localstorage
      u.email = request.email;
      u.User_name = request.email;
      u.isOnline = true;
      u.Auto_Match = true;
      await dbcnx.createUsers(u);
      // console.log("createUsers Successfully");
      let m = await dbcnx.getMatchPlayerCanJoin(request.mode);
      // console.log("getMatchPlayerCanJoin Successfully");
      if (!m) {
        m = new Match();
        m.P1_Id = u.id;
        if (!request.tournement) {
          m.id = await dbcnx.createMatch_not(request.id);
          // console.log("createMatch_not Successfully");
        }
        else {
          // m.T_Id = GET_TORNAMENTID_FROMDB
          m.id = await dbcnx.createMatch(m);
          // console.log("createMatch Successfully");
        }
      }
      else {
        if (request.mode == 2) {
          m.P2_Id = u.id;
          m.count_players = 2;
        }
        else {
          if (m.P2_Id == null) {
            m.P2_Id = u.id;
            m.count_players = 2;
          }
          else if (m.P3_Id == null) {
            m.P3_Id = u.id;
            m.count_players = 3;
          }
          else if (m.P4_Id == null) {
            m.P4_Id = u.id;
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
          ngame.gameStatus = m.gameStatus;
          ngame.T_Id = m.T_Id;
          ngame.count_players = m.count_players;
          ngame.mode = m.mode;
          matches.set(m.id, ngame);
          await dbcnx.updateMatch(m);
          for (const [email, client] of clients) {
            console.log("client.send(JSON.stringify(game));  ===>", email);
            client.send(JSON.stringify(ngame));
          }
        }

        // console.log("1updateMatch Successfully");
      }
    }
    // else if (request.type == "RESET") {
    //   let m = new Match();
    //   let prev = await dbcnx.getLasttMatchByPlayerID(request.id);
    //   let ngame = matches[prev[0].id];
    //   matches.delete(prev[0].id);
    //   m.id = await dbcnx.createMatch_not(request.id);
    //   prev[0].id = m.id;
    //   prev[0].CreatedAt = m.CreatedAt;
    //   prev[0].score_player1 = 0;
    //   prev[0].score_player2 = 0;
    //   prev[0].Winner_Id = null;
    //   prev[0].gameStatus = 'PLAYING';
    //   await dbcnx.updateMatch(prev[0]);
    //   // let m = await dbcnx.getLasttMatchByPlayerID(request.id);
    //   ngame.gameStatus = 'PLAYING';
    //   ngame.id_Match = m.id;
    //   ngame.Ball_x = 400;
    //   ngame.Ball_y = 300;
    //   ngame.Ball_dx = 2;
    //   ngame.Ball_dy = 2;
    //   ngame.Player1_x = 20;
    //   ngame.Player3_x = 60;
    //   ngame.Player4_x = 725;
    //   ngame.Player2_x = 765;
    //   ngame.Player1_y = 250;
    //   ngame.Player2_y = 250;
    //   ngame.Player3_y = 250;
    //   ngame.Player4_y = 250;
    //   ngame.score_player1 = 0;
    //   ngame.score_player2 = 0;
    //   ngame.p1UPkey = false;
    //   ngame.p1Downkey = false;
    //   ngame.p2UPkey = false;
    //   ngame.p2Downkey = false;
    //   ngame.p3UPkey = false;
    //   ngame.p3Downkey = false;
    //   ngame.p4UPkey = false;
    //   ngame.p4Downkey = false;

    // }
    // else if (request.type == "FINISHED") {
    //   m = await dbcnx.getCurrentMatchByPlayerID(u.id);
    //   if (m.score_player1 >= m.score_player2)
    //     m.Winner_Id = m.P1_Id;
    //   else
    //     m.Winner_Id = m.P2_Id;
    //   m.gameStatus = "FINISHED";
    //   await dbcnx.updateMatch(m);
    //   // console.log("3updateMatch Successfully");
    // }
    // else if (request.type == "MOVE") {
    //   m = await dbcnx.getCurrentMatchByPlayerID(u.id);
    //   let index = m.id;
    //   if (m) {
    //     if (m.P1_Id == u.id) {
    //       m.p1UPkey = request.keys.ArrowUp;
    //       m.p1Downkey = request.keys.ArrowDown;
    //     }
    //     else if (m.P2_Id == u.id) {
    //       m.p2UPkey = request.keys.ArrowUp;
    //       m.p2Downkey = request.keys.ArrowDown;
    //     }
    //     else if (m.P3_Id == u.id) {
    //       m.p3UPkey = request.keys.ArrowUp;
    //       m.p3Downkey = request.keys.ArrowDown;
    //     }
    //     else if (m.P4_Id == u.id) {
    //       m.p4UPkey = request.keys.ArrowUp;
    //       m.p4Downkey = request.keys.ArrowDown;
    //     }
    //     await dbcnx.updateMatch(m);
    //   }
    //   else
    //     console.log("match not found ", u.id);
    // }

    // let m = await dbcnx.getCurrentMatchByPlayerID(request.id);
    // console.log("getCurrentMatchByPlayerID Successfully");
    // console.log("m ==== ", m);
    // if (m && matches[m.id]) {
    //   matches[m.id].id_Match = m.id;
    //   matches[m.id].P1_Id = m.P1_Id;
    //   matches[m.id].P2_Id = m.P2_Id;
    //   matches[m.id].P3_Id = m.P3_Id;
    //   matches[m.id].P4_Id = m.P4_Id;
    //   matches[m.id].gameStatus = m.gameStatus;
    //   matches[m.id].T_Id = m.T_Id;
    //   matches[m.id].count_players = m.count_players;
    //   matches[m.id].mode = m.mode;
    //   if (matches[m.id].count_players == matches[m.id].mode) {
    //     if (matches[m.id].gameStatus != "PLAYING")
    //       matches[m.id].gameStatus = "PLAYING";
    //     for (const [email, client] of clients) {
    //       {
    //         console.log("client.send(JSON.stringify(game));  ===>", email);
    //         client.send(JSON.stringify(game));
    //       }
    //     }
    //   }
    // }
    // else
    //   console.log("game undefiend ", request.id);




















    // ----------------------------------
    // const request = JSON.parse(msg);

    // let u = await dbcnx.getUserByEmail(request.email);
    // if (!u)
    //   u = new Users();
    // let m = await dbcnx.getCurrentMatchByPlayerID(request.email);
    // if (!m)
    //   m = new Match();
    // // console.log("Client connected : ", request.email);
    // if (clients.has(request.email)) {
    //   try {
    //     // console.log("try : ", request.email);
    //     if (clients.get(request.email) != connection) {
    //       // console.log("close : ", request.email);
    //       clients.get(request.email).close();
    //     }
    //   }
    //   catch (e) {
    //     console.log("error: ", request.email, e);

    //   }
    // }
    // clients.set(request.email, connection);
    // console.log("Total clients : ", clients.size);
    // console.log("request.type === ", request.type);
    // u.id = request.id; //to add in localstorage
    // u.email = request.email;
    // u.User_name = request.email;
    // u.isOnline = true;
    // u.Auto_Match = true;
    // if (request.type == "REGISTER") {
    //   try {
    //     await dbcnx.createUsers(u);
    //     // console.log("createUsers Successfully");
    //   }
    //   catch (e) {
    //     console.log("Error : createUsers", e);
    //     console.log(u);
    //   }
    //   try {
    //     m = await dbcnx.getMatchPlayerCanJoin(u.id, request.mode);
    //     // console.log("getMatchPlayable Successfully");
    //   }
    //   catch (e) {
    //     console.log("Error : getMatchPlayerCanJoin ", e);
    //     console.log(u, request.mode);
    //     // return;
    //   }
    //   if (!m) {
    //     m = new Match();
    //     m.P1_Id = u.id;
    //     m.count_players = 1;
    //     if (!request.tournement) {
    //       try {
    //         await dbcnx.createMatch_not(m);
    //         // console.log("createMatch Successfully");
    //       }
    //       catch (e) {
    //         console.log("Error : createMatch_not ", e);
    //         console.log(m);
    //       }
    //     }
    //     else {
    //       try {
    //         // m.T_Id = GET_TORNAMENTID_FROMDB
    //         await dbcnx.createMatch(m);
    //         // console.log("createMatch Successfully");
    //       }
    //       catch (e) { console.log("Error : createMatch ", e); console.log(m); }
    //     }
    //   }
    //   else {
    //     if (request.mode == 2) {
    //       m.P2_Id = u.id;
    //       m.count_players = 2;
    //     }
    //     else {
    //       if (m.P2_Id == null) {
    //         m.P2_Id = u.id;
    //         m.count_players = 2;
    //       }
    //       else if (m.P3_Id == null) {
    //         m.P3_Id = u.id;
    //         m.count_players = 3;
    //       }
    //       else if (m.P4_Id == null) {
    //         m.P4_Id = u.id;
    //         m.count_players = 4;
    //       }
    //     }
    //     if (m.count_players == m.mode) {
    //       {
    //         m.gameStatus = "PLAYING";
    //         // m.result = "PENDING";
    //       }
    //     }
    //     try {
    //       await dbcnx.updateMatch(m);
    //       // console.log("1updateMatch Successfully");
    //     }
    //     catch (e) {
    //       console.log("1Error : updateMatch ", e);
    //       console.log(m);
    //       // return;
    //     }
    //   }

    // }
    // else if (request.type == "RESET") {
    //   m.Ball_x = 400;
    //   m.Ball_y = 300;
    //   m.Player1_x = 20;
    //   m.Player3_x = 60;
    //   m.Player4_x = 725;
    //   m.Player2_x = 765;
    //   m.Player1_y = 250;
    //   m.Player2_y = 250;
    //   m.Player3_y = 250;
    //   m.Player4_y = 250;
    //   m.score_player1 = 0;
    //   m.score_player2 = 0;
    //   // this.p1UPkey = false;
    //   // this.p1Downkey = false;
    //   // this.p2UPkey = false;
    //   // this.p2Downkey = false;
    //   // this.p3UPkey = false;
    //   // this.p3Downkey = false;
    //   // this.p4UPkey = false;
    //   // this.p4Downkey = false;
    //   m.gameStatus = "PLAYING";
    //   try {
    //     await dbcnx.updateMatch(m);
    //     // console.log("2updateMatch Successfully");
    //   }
    //   catch (e) {
    //     console.log("2Error : updateMatch ", e);
    //     console.log(m);
    //     return;
    //   }
    // }
    // else if (request.type == "FINISHED") {
    //   try { m = await dbcnx.getCurrentMatchByPlayerID(u.id); }
    //   catch (e) { console.log("Error :", e, u.id) }
    //   if (m.score_player1 >= m.score_player2)
    //     m.Winner_Id = m.P1_Id;
    //   else
    //     m.Winner_Id = m.P2_Id;
    //   m.gameStatus = "FINISHED";
    //   try {
    //     await dbcnx.updateMatch(m);
    //     // console.log("3updateMatch Successfully");
    //   }
    //   catch (e) {
    //     console.log("3Error : updateMatch ", e);
    //     return;
    //   }
    // }
    // else if (request.type == "MOVE") {
    //   try { m = await dbcnx.getCurrentMatchByPlayerID(u.id); }
    //   catch (e) { console.log("Error :", e, u.id) }
    //   // console.log("4getMatchById Successfully");
    //   // }
    //   // catch (e) {
    //   //   console.log("4Error : getMatchById ", e);
    //   //   console.log(u.id);
    //   // }
    //   // console.log("m ------------- >>>>>> ", m);
    //   if (m) {
    //     if (m.P1_Id == u.id) {
    //       m.p1UPkey = request.keys.ArrowUp;
    //       m.p1Downkey = request.keys.ArrowDown;
    //     }
    //     else if (m.P2_Id == u.id) {
    //       m.p2UPkey = request.keys.ArrowUp;
    //       m.p2Downkey = request.keys.ArrowDown;
    //     }
    //     else if (m.P3_Id == u.id) {
    //       m.p3UPkey = request.keys.ArrowUp;
    //       m.p3Downkey = request.keys.ArrowDown;
    //     }
    //     else if (m.P4_Id == u.id) {
    //       m.p4UPkey = request.keys.ArrowUp;
    //       m.p4Downkey = request.keys.ArrowDown;
    //     }
    //     try {
    //       await dbcnx.updateMatch(m);
    //       // console.log("5updateMatch Successfully");
    //     }
    //     catch (e) {
    //       console.log("5Error : updateMatch ", e);
    //       console.log(m);
    //     }

    //     // console.log("game  === ", game);
    //   }
    //   else
    //     console.log("match not found ", u.id);
    // }
    // await dbcnx.updateMatch(m);
    // try { m = await dbcnx.getCurrentMatchByPlayerID(u.id); }
    // catch (e) { console.log("Error :", e, u.id) }
    // if (m) {
    //   game.id_Match = m.id;
    //   game.P1_Id = m.P1_Id;
    //   game.P2_Id = m.P2_Id;
    //   game.P3_Id = m.P3_Id;
    //   game.P4_Id = m.P4_Id;
    //   game.gameStatus = m.gameStatus;
    //   game.T_Id = m.T_Id;
    //   game.count_players = m.count_players;
    //   game.mode = m.mode;
    // }
    // else
    //   console.log("game undefiend ", u.id);
    // if (game.count_players == game.mode) {
    //   // console.log("if (clients.size == 2)   === ");
    //   if (game.gameStatus != "PLAYING")
    //     game.gameStatus = "PLAYING";
    //   // for (const client of clients) {
    //   //   client.send(JSON.stringify(gameState));
    //   // }
    //   for (const [email, client] of clients) {
    //     {
    //       console.log("client.send(JSON.stringify(game));  ===>", email);
    //       client.send(JSON.stringify(game));
    //     }
    //   }
    // }




    // *********************************
    // // "insert into match values ()"
    // if (request.type == "register") {
    //   if (request.email == email1 && gameState.player1Name == "") {
    //     gameState.player1Name = request.email;
    //     gameState.count++;
    //   }
    //   else if (request.email == email2 && gameState.player2Name == "") {
    //     gameState.player2Name = request.email;
    //     gameState.count++;
    //   }
    // }
    // if (request.type == "reset") {
    //   gameState.gameStatus = "PLAYING";
    //   gameState.score1 = 0;
    //   gameState.score2 = 0;
    //   resetBall(1);
    // }
    // if (request.type == "finished") {
    //   console.log(request.email, "  server   finished");
    //   gameState = {
    //     ball: { x: 400, y: 300, dx: 2, dy: 2, radius: 8 },
    //     paddle1: { x: 20, y: 250 },
    //     paddle2: { x: 765, y: 250 },
    //     paddle3: { x: 60, y: 250 },
    //     paddle4: { x: 725, y: 250 },
    //     width: 800,
    //     height: 600,
    //     score1: 0,
    //     score2: 0,
    //     sizePaddle: { width: 15, height: 100 },
    //     player1Name: "",
    //     player2Name: "",
    //     gameStatus: "finished",
    //     count: 0,
    //     p1keys: { ArrowUp: false, ArrowDown: false },
    //     p2keys: { ArrowUp: false, ArrowDown: false }
    //   };
    //   clients.get(request.email).close();
    // }
    // if (request.email == email1) {
    //   gameState.p1keys.ArrowUp = request.keys.ArrowUp;
    //   gameState.p1keys.ArrowDown = request.keys.ArrowDown;
    // }
    // else if (request.email == email2) {
    //   gameState.p2keys.ArrowUp = request.keys.ArrowUp;
    //   gameState.p2keys.ArrowDown = request.keys.ArrowDown;
    // }
    // if (request.type == "start" && clients.size == 2) {
    //   if (gameState.gameStatus != "PLAYING")
    //     gameState.gameStatus = "PLAYING";
    //   // for (const client of clients) {
    //   //   client.send(JSON.stringify(gameState));
    //   // }
    //   for (const [email, client] of clients) {
    //     client.send(JSON.stringify(gameState));
    //   }
    // }
  });

  // const interval = setInterval(() => {
  //   if (clients.size == 0)
  //     return;
  //   // tick();
  //   // connection.send(JSON.stringify(gameState));
  // }, 1000 / TICK_RATE);
  connection.on("close", () => {
    // clients.delete(connection);
    for (const [email, client] of clients) {
      if (client == connection) {
        console.log("close old :", email);
        clients.delete(email);
        break;
      }
    }
    // clearInterval(interval);
    console.log("Client disconnected. Total clients:", clients.size);
  });
});

fastify.listen({ port: 3000, host: "0.0.0.0" });
