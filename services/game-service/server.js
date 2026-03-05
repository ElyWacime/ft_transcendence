  import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fjwt from "@fastify/jwt";  
import websocket from "@fastify/websocket";
import cors from "@fastify/cors";
import * as fs from "fs";
import https from "https";
import { randomUUID } from "crypto"; // used to generate unique tournament ids for in-memory rooms; survives only while the process is alive
import { Users, Match, SQLiteDB, GameState } from "./DBController.js";

const httpsOptions = process.env.USE_HTTPS === "true" ? {
  https: {
    key: fs.readFileSync("/app/certs/private.key"),
    cert: fs.readFileSync("/app/certs/certificate.crt"),
  }
} : {};

const fastify = Fastify({ 
  logger: false,
  ...httpsOptions
});

// Create HTTPS agent for self-signed certificates
const httpsAgent = process.env.USE_HTTPS === "true" ? new https.Agent({
  rejectUnauthorized: false
}) : undefined;

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
let tournaments = new Map(); // in-memory store for online tournament state (blown away on restart; persistence not required for quick-fire brackets)
const TICK_RATE = 60;
const PADDLE_SPEED = 8;
const MAX_Speed = 25;
const MAX_Score = 5;

await dbcnx.connect();


const sendtoplayer = async (id, data) => {
  if (id) {
    let socket = (clients.get(id));
    if (socket) {
      if (socket.readyState === 1) {
        socket.send(data);
        console.log("Sent data to player:", id, "readyState:", socket.readyState);
      } else {
        console.log("Cannot send to player:", id, "readyState:", socket.readyState, "(expected 1)");
      }
    } else {
      console.log("Socket not found for player:", id);
    }
  }
}

// ---

// broadcast a payload to every connected websocket client
// this is intentionally dumb fan-out: every player gets the same snapshot so UIs stay eventually consistent
function broadcastAll(data) {
  const payload = typeof data === "string" ? data : JSON.stringify(data);
  for (const [, socket] of clients) {
    if (socket && socket.readyState === 1) {
      socket.send(payload);
    }
  }
}

// push current tournaments snapshot to all players so UIs stay live-synced
// we send a flat array; clients reconcile on their side (no diffing server-side to keep logic simple)
const broadcastTournamentState = () => {
  const snapshot = Array.from(tournaments.values());
  broadcastAll({ type: "TOURNAMENTS_STATE", tournaments: snapshot });
};
// remove a participant from a tournament after elimination without unlocking the room
// we intentionally keep the tournament marked as full so no new joins are allowed mid-bracket
const eliminateParticipant = (tournament, participantId) => {
  if (!participantId || !tournament) return;
  tournament.participants = tournament.participants.filter((p) => p.id !== participantId);
  // keep the room locked once it had 4 players; do NOT flip full back to false
  tournament.full = true;
};
// ---------
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
    updateTournamentAfterMatch(m);

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

// ----------------- Tournament helpers -----------------

// build two semifinal slots once 4 participants join
// slot ids are stable and namespaced with tournament id to avoid clashes across rooms
const buildSemifinals = (participants, tournamentId) => {
  const [p1, p2, p3, p4] = participants;
  return [
    { id: `${tournamentId}-semi1`, player1: p1, player2: p2, winner: null, ready: {}, readyAt: {}, matchId: null },
    { id: `${tournamentId}-semi2`, player1: p3, player2: p4, winner: null, ready: {}, readyAt: {}, matchId: null },
  ];
};

// create a new in-memory tournament room seeded with the creator as first participant
// no DB write here: tournaments are ephemeral and only need to exist for the lifetime of matches
const createTournamentRoom = (creator) => {
  const id = randomUUID();
  const tournament = {
    id,
    active: true,
    createdBy: creator?.id || null,
    createdByName: creator?.name || creator?.email || "Unknown",
    createdAt: new Date().toISOString(),
    participants: creator ? [creator] : [],
    full: false,
    status: "waiting",
    semifinals: [],
    final: null,
    winner: null,
  };
  tournaments.set(id, tournament);
  broadcastTournamentState();
  return tournament;
};

// handle leave tournament (only allowed before the bracket is full)
const leaveTournamentRoom = (id, participant) => {
  const tournament = tournaments.get(id);
  if (!tournament) return null;

  // if the tournament is finished and the winner is the last remaining participant, delete the room
  if (
    tournament.status === "completed" &&
    tournament.winner?.id === participant.id &&
    tournament.participants.length === 1
  ) {
    tournaments.delete(id);
    broadcastTournamentState();
    return null;
  }

  // once 4 players are locked in, don't allow leaving to keep brackets stable
  if (tournament.full || tournament.participants.length >= 4) {
    return tournament;
  }

  // remove the participant by id
  tournament.participants = tournament.participants.filter((p) => p.id !== participant.id);

  // reset state since we are back to a waiting room
  tournament.full = tournament.participants.length >= 4;
  tournament.status = tournament.full ? tournament.status : "waiting";
  if (!tournament.full) {
    tournament.semifinals = [];
    tournament.final = null;
    tournament.winner = null;
  }

  // delete empty tournaments to avoid clutter
  console.log("This is leaveTournamentRoom >> ", tournament.participants.length);
  if (tournament.participants.length === 0) {
    tournaments.delete(id);
  } else {
    tournaments.set(id, tournament);
  }

  broadcastTournamentState();
  return tournament;
};

// add a player to a tournament; when full, auto-generate bracket scaffolding
// we gate at 4 participants and immediately build semis + a final placeholder
const joinTournamentRoom = (id, participant) => {
  const tournament = tournaments.get(id);
  if (!tournament || tournament.full) return tournament;
  const exists = tournament.participants.some((p) => p.id === participant.id);
  if (!exists) {  
    tournament.participants.push(participant);
  }
  tournament.full = tournament.participants.length >= 4;
  if (tournament.full && tournament.participants.length >= 4) {
    // notify all four participants that semifinals are waiting
    const firstFour = tournament.participants.slice(0, 4);
    for (const p of firstFour) {
      const waiting = new GameState();
      waiting.waitingMatch = true;
      sendtoplayer(p.id, JSON.stringify(waiting));
    }
    tournament.status = "semifinals";
    tournament.semifinals = buildSemifinals(tournament.participants.slice(0, 4), tournament.id);
    tournament.final = { id: `${tournament.id}-final`, player1: null, player2: null, winner: null, ready: {}, readyAt: {}, matchId: null };
  }
  tournaments.set(id, tournament);
  broadcastTournamentState();
  return tournament;
};

// notify the two players in a bracket slot that their match is ready
// front-end listens for this payload and self-navigates to the arena (/loading?mode=2) with its own token
const notifyPlayersMatchReady = (tournament, matchSlot, mode = 2) => {
  const payload = {
    type: "TOURNAMENT_MATCH_READY",
    tournamentId: tournament.id,
    matchId: matchSlot.id,
    matchDbId: matchSlot.matchId,
    player1: matchSlot.player1,
    player2: matchSlot.player2,
    mode,
  };
  sendtoplayer(matchSlot.player1?.id, JSON.stringify(payload));
  sendtoplayer(matchSlot.player2?.id, JSON.stringify(payload));
};

// create a VIP match row for this bracket slot if not already created and cache its id on the slot
// VIP matches let us run isolated 1v1 games tied to a tournament without polluting general matchmaking
const ensureVipMatch = async (matchSlot, tournamentId) => {
  if (matchSlot.matchId) return matchSlot.matchId;
  const m = new Match();
  m.P1_Id = matchSlot.player1?.id;
  m.P2_Id = matchSlot.player2?.id;
  m.count_players = 2;
  m.T_Id = tournamentId;
  const newId = await dbcnx.createVIPMatch(m);
  matchSlot.matchId = newId;
  return newId;
};

// mark a player as ready for their bracket match; once both ready, spin up/attach VIP match and notify
// ready state is stored on the match slot to avoid per-user global flags
const handleTournamentReady = async (tournamentId, matchId, playerId) => {
  const tournament = tournaments.get(tournamentId);
  if (!tournament) return;
  const allMatches = [...(tournament.semifinals || []), tournament.final].filter(Boolean);
  const matchSlot = allMatches.find((m) => m.id === matchId);
  if (!matchSlot || !matchSlot.player1 || !matchSlot.player2) return;
  matchSlot.createdAt = new Date();
  matchSlot.readyAt = matchSlot.readyAt || {};

  matchSlot.ready = { ...matchSlot.ready, [playerId]: true };
  matchSlot.readyAt[playerId] = new Date().toISOString();

  const p1Ready = Boolean(matchSlot.ready[matchSlot.player1.id]);
  const p2Ready = Boolean(matchSlot.ready[matchSlot.player2.id]);
  const bothReady = p1Ready && p2Ready;

  if (bothReady) {
    // create/ensure DB match row
    const matchDbId = await ensureVipMatch(matchSlot, tournamentId);
    matchSlot.matchId = matchDbId;

    // hydrate runtime game state and start it immediately so tick loop can drive the ball
    let dbMatch = await dbcnx.getMatchById(matchDbId);
    if (!dbMatch) {
      dbMatch = new Match();
      dbMatch.id = matchDbId;
      dbMatch.P1_Id = matchSlot.player1.id;
      dbMatch.P2_Id = matchSlot.player2.id;
      dbMatch.mode = 2;
      dbMatch.count_players = 2;
      dbMatch.T_Id = tournamentId;
    }
    dbMatch.gameStatus = "PLAYING";
    dbMatch.count_players = 2;
    dbMatch.mode = 2;
    dbMatch.T_Id = tournamentId;
    await dbcnx.updateMatch(dbMatch);

    const g = new GameState();
    g.id = matchDbId;
    g.P1_Id = matchSlot.player1.id;
    g.P2_Id = matchSlot.player2.id;
    g.T_Id = tournamentId;
    g.count_players = 2;
    g.mode = 2;
    g.gameStatus = "PLAYING";
    g.player1Name = clients_info.get(g.P1_Id) || matchSlot.player1.name;
    g.player2Name = clients_info.get(g.P2_Id) || matchSlot.player2.name;

    matches.set(g.id, g);

    // immediately tell both players their match is ready so UI navigates and also seeds them with state
    notifyPlayersMatchReady(tournament, matchSlot, 2);
    const payload = JSON.stringify(g);
    sendtoplayer(g.P1_Id, payload);
    sendtoplayer(g.P2_Id, payload);
  }

  // always broadcast the latest ready state so UIs reflect button disabled/ready indicators
  broadcastTournamentState();
};

// player reports opponent missing; if reporter has been ready for >=1 minute and opponent not ready, auto-advance reporter
const handleReportMissingOpponent = (tournamentId, matchId, reporterId) => {
  
  console.log("This is handleReportMissingOpponent >> ", tournamentId, matchId, reporterId);
  const tournament = tournaments.get(tournamentId);
  if (!tournament) return;

  const semifinals = tournament.semifinals || [];
  const finalMatch = tournament.final;
  const allMatches = [...semifinals, finalMatch].filter(Boolean);
  const matchSlot = allMatches.find((m) => m.id === matchId);
  if (!matchSlot) return;

  // --- Final edge case: reporter is alone for >=3 minutes since tournament creation
  const isFinal = finalMatch && finalMatch.id === matchId;
  if (isFinal) {
    const reporterIsPlayer1 = matchSlot.player1?.id === reporterId;
    const reporterIsPlayer2 = matchSlot.player2?.id === reporterId;
    const soloPlayer = reporterIsPlayer1 ? matchSlot.player1 : reporterIsPlayer2 ? matchSlot.player2 : null;
    const opponent = reporterIsPlayer1 ? matchSlot.player2 : reporterIsPlayer2 ? matchSlot.player1 : null;

    if (soloPlayer && !opponent) {
      const createdAtMs = tournament.createdAt ? new Date(tournament.createdAt).getTime() : null;
      const THREE_MINUTES_MS = 60_000;
      const threeMinutesElapsed = createdAtMs ? Date.now() - createdAtMs >= THREE_MINUTES_MS : false;
      if (threeMinutesElapsed) {
        finalMatch.winner = soloPlayer;
        tournament.winner = soloPlayer;
        tournament.status = "completed";

        // remove any lingering participants who aren't the winner
        const remaining = tournament.participants.filter((p) => p.id !== soloPlayer.id);
        for (const leftover of remaining) {
          eliminateParticipant(tournament, leftover.id);
        }

        tournaments.set(tournamentId, tournament);
        broadcastTournamentState();
        return;
      }
    }
  }

  if (!matchSlot.player1 || !matchSlot.player2) return;

  console.log("after match check >> ", matchSlot);
  matchSlot.readyAt = matchSlot.readyAt || {};
  matchSlot.ready = matchSlot.ready || {};

  const reporterReadyAt = matchSlot.readyAt[reporterId];
  const reporterReady = Boolean(matchSlot.ready[reporterId]);
  if (!reporterReady || !reporterReadyAt) return; // reporter never readied or timestamp missing

  const opponent = matchSlot.player1.id === reporterId ? matchSlot.player2 : matchSlot.player1;
  if (!opponent) return;
  const opponentReady = Boolean(matchSlot.ready[opponent.id]);
  if (opponentReady) return; // opponent already ready; nothing to report

  const diffMs = Date.now() - new Date(reporterReadyAt).getTime();
  if (diffMs < 60_000) return; // less than 1 minute wait

  // advance reporter, drop opponent
  matchSlot.winner = matchSlot.player1.id === reporterId ? matchSlot.player1 : matchSlot.player2;
  eliminateParticipant(tournament, opponent.id);

  if (semifinals.includes(matchSlot)) {
    if (tournament.final) {
      if (!tournament.final.player1) {
        tournament.final.player1 = matchSlot.winner;
      } else if (!tournament.final.player2 && tournament.final.player1.id !== matchSlot.winner.id) {
        tournament.final.player2 = matchSlot.winner;
      }
      tournament.final.ready = {};
      tournament.final.readyAt = {};
      if (tournament.final.player1 && tournament.final.player2) {
        tournament.final.matchId = null;
        tournament.status = "finals";
      }
    }
  } else if (finalMatch && finalMatch.id === matchId) {
    finalMatch.winner = matchSlot.winner;
    tournament.winner = matchSlot.winner;
    tournament.status = "completed";
  }

  tournaments.set(tournamentId, tournament);
  broadcastTournamentState();
};

// after a match finishes, advance bracket (promote semifinal winners to final or crown winner)
// we accept GameState from the running match tick loop and reflect winners back into the tournament map
const updateTournamentAfterMatch = (gameState) => {
  if (!gameState?.T_Id) return;
  const tournamentId = gameState.T_Id;
  const tournament = tournaments.get(tournamentId);
  if (!tournament) return;

  const { Winner_Id } = gameState;
  const winnerParticipant = tournament.participants.find((p) => p.id === Winner_Id);

  const semifinals = tournament.semifinals || [];
  const finalMatch = tournament.final;

  const semMatch = semifinals.find((m) => m.matchId === gameState.id);
  if (semMatch) {
    semMatch.winner = winnerParticipant || { id: Winner_Id, name: clients_info.get(Winner_Id) || "Winner" };
    // eliminate the losing participant and keep the bracket locked
    const p1Id = semMatch.player1?.id;
    const p2Id = semMatch.player2?.id;
    const loserId = Winner_Id === p1Id ? p2Id : p1Id;
    if (loserId) eliminateParticipant(tournament, loserId);

    if (tournament.final) {
      // only fill an empty slot; avoid showing the same semifinal winner on both sides before the second semi finishes
      if (!tournament.final.player1) {
        tournament.final.player1 = semMatch.winner;
      } else if (!tournament.final.player2 && tournament.final.player1.id !== semMatch.winner.id) {
        tournament.final.player2 = semMatch.winner;
      }
      // finalists must ready-up again; also force a fresh match id for the final once both sides are known
      tournament.final.ready = {};
      if (tournament.final.player1 && tournament.final.player2) {
        tournament.final.matchId = null;
        tournament.status = "finals";

        // notify both finalists that there's a match waiting for them(if they are not in the tournamnt page)
        const finalists = [tournament.final.player1, tournament.final.player2].filter(Boolean);
        for (const p of finalists) {
          const waiting = new GameState();
          waiting.waitingMatch = true;
          sendtoplayer(p.id, JSON.stringify(waiting));
        }
      }
    }
  } else if (finalMatch && finalMatch.matchId === gameState.id) {
    finalMatch.winner = winnerParticipant || { id: Winner_Id, name: clients_info.get(Winner_Id) || "Winner" };
    // eliminate the finalist who lost; keep tournament locked
    const p1Id = finalMatch.player1?.id;
    const p2Id = finalMatch.player2?.id;
    const loserId = Winner_Id === p1Id ? p2Id : p1Id;
    if (loserId) eliminateParticipant(tournament, loserId);

    tournament.winner = finalMatch.winner;
    tournament.status = "completed";
  }

  tournaments.set(tournamentId, tournament);
  broadcastTournamentState();
};


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

fastify.get('/tournaments-online', async (_request, reply) => {
  try {
    const snapshot = Array.from(tournaments.values());
    return snapshot;
  } catch (e) {
    return reply.code(500).send({ message: "Failed to load tournaments" });
  }
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
  try {
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
    console.log("User created/updated:", id);
    
    let m = await dbcnx.getOngoingMatch(id);
    console.log("Ongoing match for user:", id, ":", m ? m.id : "none");
    
    if (!m) 
    {
      m = await dbcnx.getOpenRoom(request.mode);
      console.log("Open room for mode", request.mode, ":", m ? m.id : "creating new");
      
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
        console.log("Created new match:", m.id, "for user:", id);
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
        console.log("Added user", id, "to existing match", m.id);
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
        console.log("Match is full! Starting game for match:", m.id);
    }
    ngame.gameStatus = m.gameStatus;
    let data = JSON.stringify(ngame);
    await dbcnx.updateMatch(m);
    console.log("Sending game state to players for match:", m.id);
    // console.log("Server wiill send ::: ",ngame);
    sendtoplayer(ngame.P1_Id, data);
    sendtoplayer(ngame.P2_Id, data);
    sendtoplayer(ngame.P3_Id, data);
    sendtoplayer(ngame.P4_Id, data);
  } catch (error) {
    console.error("Error in handelRegister for user:", id, "-", error);
  }
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
    updateTournamentAfterMatch(m);
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
    const protocol = process.env.USE_HTTPS === "true" ? "https" : "http";
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (httpsAgent) {
      fetchOptions.agent = httpsAgent;
    }
    
    const response = await fetch(`${protocol}://auth-service:8000/get-user/${id}`, fetchOptions);
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
      // if (msg.waitingMatch)
      // {
      //   // pop up that says a match is waiting for you.
      //   console.log("This is waitingMatch >>>>> ",request.waitingMatch);
      //   alert("A match is waiting for you. Please navigate to the arena.");
        
      // }
      let token = request.token;
      console.log("<<<<<<<< <<<<<<<< This is server.js  >>>>>>>>>>>>",request.type);
      if (token) {
          let decoded;
          try {
            decoded = req.jwt.verify(token);
          } catch (jwtError) {
            console.error("JWT verification failed:", jwtError.message);
            connection.send(JSON.stringify({ error: "JWT verification failed" }));
            return;
          }
          const id = decoded.id;
          const email = decoded.email;
          const name = decoded.name;
          console.log("User connected with id:", id, "type:", request.type);
          await handelDup(connection,id);
          clients.set(id, connection);
          if (request.type == "REGISTER") {
            console.log("Handling REGISTER for user:", id, "mode:", request.mode);
            await handelRegister(request,id,email,name);
          }
          else if (request.type == "MOVE") 
            await handelMove(request,id);
          else if (request.type == "FINISHED") 
            await  handelFinish(request.matchId) ;
          else if (request.type == "DELETE") 
            await handelRoomQuiiting(id);
          else if (request.type == "TOURNAMENT_CREATE") {
          const creator = { id, name: name || email || id };
          createTournamentRoom(creator);
        }

        else if (request.type == "TOURNAMENT_LEAVE") 
          {
          const participant = { id, name: name || email || id };
          leaveTournamentRoom(request.tournamentId, participant);
          }
        else if (request.type == "TOURNAMENT_JOIN") {
          const participant = { id, name: name || email || id };
          joinTournamentRoom(request.tournamentId, participant);
        }
        else if (request.type == "TOURNAMENT_READY") {
          await handleTournamentReady(request.tournamentId, request.matchId, id);
        }
        else if (request.type == "TOURNAMENT_REPORT_MISSING") {
          handleReportMissingOpponent(request.tournamentId, request.matchId, id);
        }
        else if (request.type == "REQUEST_TOURNAMENTS") {
          sendtoplayer(id, JSON.stringify({ type: "TOURNAMENTS_STATE", tournaments: Array.from(tournaments.values()) }));
        }
      }
      else 
        console.log("No token provided, proceeding without authentication");
   }
   catch (e)
   {
      console.error("WebSocket message handler error:", e);
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

fastify.post('/sync-email', async (request, reply) => {
  try {
    const { userId, email } = request.body;
    
    if (!userId || !email) {
      return reply.code(400).send({ message: 'userId and email are required' });
    }

    const existingUser = await dbcnx.getUserById(userId);
    
    if (existingUser) {
      await dbcnx.db.run(
        `UPDATE Users SET email = ? WHERE id = ?`, 
        [email, userId]
      );
      
      return reply.send({ success: true, message: 'Email synced successfully' });
    } else {
      return reply.send({ success: true, message: 'User not in game service yet' });
    }
  } catch (error) {
    console.error('Error syncing email:', error);
    return reply.code(500).send({ message: 'Failed to sync email' });
  }
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

const useHttps = process.env.USE_HTTPS === "true";
const port = 3000;

fastify.listen({ port, host: "0.0.0.0" });
console.log(`Game server listening on port ${port} (${useHttps ? 'HTTPS' : 'HTTP'})`);
