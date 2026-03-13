import Fastify from "fastify";
import websocket from "@fastify/websocket";
import cors from "@fastify/cors";
import * as fs from "fs";
import https from "https";
import { randomUUID } from "crypto"; 
import { Match, SQLiteDB, GameState } from "./DBController.js";


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

await fastify.register(websocket);

await fastify.register(cors, {
  origin: true,
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","Origin","X-Requested-With","Accept","Cookie"],
});

let dbcnx = new SQLiteDB();
let clients = new Map();
let matches = new Map();
let tokens = new Map();
let tournaments = new Map();
const TICK_RATE = 60;
const PADDLE_SPEED = 8;
const MAX_Speed = 25;
const MAX_Score = 5;

await dbcnx.connect();

async function desToken(request)
{
   const protocol = process.env.USE_HTTPS === "true" ? "https" : "http";
   
   let token = null;
   const authHeader = request.headers.authorization;
   
   if (authHeader && authHeader.startsWith('Bearer ')) {
     token = authHeader.substring(7); 
   } else if (request.cookies.access_token) {
     token = request.cookies.access_token; 
   }
   
   if (!token) {
     return { status: 401, error: 'No token provided' };
   }
   
   const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
   };
   
   try {
     const response = await fetch(`${protocol}://auth-service:8000/validate_token`, fetchOptions);
     
     if (response.status === 200) {
       const data = await response.json();
       const userData = { 
         status: 200, 
         user_id: data.user_id,
       };
       tokens.set(token, userData); 
       return userData;
     }
     
     return { status: response.status, error: 'Authentication failed' };
   } catch (error) {
     console.error('Auth service error:', error);
     return { status: 500, error: 'Auth service unavailable' };
   }
}

const sendtoplayer = async (id, data) => 
{
  if (id) {
    let socket = (clients.get(id));
    if (socket && socket.readyState === 1)
      socket.send(data);
    }
}

function broadcastAll(data) {
  const payload = typeof data === "string" ? data : JSON.stringify(data);
  for (const [, socket] of clients) {
    if (socket && socket.readyState === 1) {
      socket.send(payload);
    }
  }
}

const broadcastTournamentState = () => {
  const snapshot = Array.from(tournaments.values());
  broadcastAll({ type: "TOURNAMENTS_STATE", tournaments: snapshot });
};

const eliminateParticipant = (tournament, participantId) => {
  if (!participantId || !tournament) return;
  tournament.participants = tournament.participants.filter((p) => p.id !== participantId);

  tournament.full = true;
};

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

const buildSemifinals = (participants, tournamentId) => {
  const [p1, p2, p3, p4] = participants;
  return [
    { id: `${tournamentId}-semi1`, player1: p1, player2: p2, winner: null, ready: {}, readyAt: {}, matchId: null },
    { id: `${tournamentId}-semi2`, player1: p3, player2: p4, winner: null, ready: {}, readyAt: {}, matchId: null },
  ];
};

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

const leaveTournamentRoom = (id, participant) => {
  const tournament = tournaments.get(id);
  if (!tournament) return null;

  if (
    tournament.status === "completed" &&
    tournament.winner?.id === participant.id &&
    tournament.participants.length === 1
  ) {
    tournaments.delete(id);
    broadcastTournamentState();
    return null;
  }

  const tournamentLocked = tournament.full || tournament.participants.length >= 4;
  const tournamentFinished = tournament.status === "completed" || Boolean(tournament.winner);
  if (tournamentLocked && !tournamentFinished) {
    return tournament;
  }

  tournament.participants = tournament.participants.filter((p) => p.id !== participant.id);

  tournament.full = tournament.participants.length >= 4;
  tournament.status = tournament.full ? tournament.status : "waiting";
  if (!tournament.full) {
    tournament.semifinals = [];
    tournament.final = null;
    tournament.winner = null;
  }

  if (tournament.participants.length === 0) {
    tournaments.delete(id);
  } else {
    tournaments.set(id, tournament);
  }

  broadcastTournamentState();
  return tournament;
};

const joinTournamentRoom = (id, participant) => {
  const tournament = tournaments.get(id);
  if (!tournament || tournament.full) return tournament;
  const exists = tournament.participants.some((p) => p.id === participant.id);
  if (!exists) {  
    tournament.participants.push(participant);
  }
  tournament.full = tournament.participants.length >= 4;
  if (tournament.full && tournament.participants.length >= 4) {
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

    let [m1, m2]= await Promise.all([dbcnx.getAvaiable(matchSlot.player1.id), dbcnx.getAvaiable(matchSlot.player2.id)]);
      if (m1 || m2) {
        if (m1) {
          matchSlot.ready[matchSlot.player1.id] = false;
          matchSlot.readyAt[matchSlot.player1.id] = null;
        }
        if (m2) {
          matchSlot.ready[matchSlot.player2.id] = false;
          matchSlot.readyAt[matchSlot.player2.id] = null;
        }
        broadcastTournamentState();
        return;
      }



    const matchDbId = await ensureVipMatch(matchSlot, tournamentId);
    matchSlot.matchId = matchDbId;

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
    g.player1Name = (g.P1_Id);
    g.player2Name = (g.P2_Id);

    matches.set(g.id, g);

    notifyPlayersMatchReady(tournament, matchSlot, 2);
    const payload = JSON.stringify(g);
    sendtoplayer(g.P1_Id, payload);
    sendtoplayer(g.P2_Id, payload);
  }

  broadcastTournamentState();
};

const handleReportMissingOpponent = async (tournamentId, matchId, reporterId) => {
  
  const tournament = tournaments.get(tournamentId);
  if (!tournament) return;

  const semifinals = tournament.semifinals || [];
  const finalMatch = tournament.final;
  const allMatches = [...semifinals, finalMatch].filter(Boolean);
  const matchSlot = allMatches.find((m) => m.id === matchId);
  if (!matchSlot) return;

  const isFinal = finalMatch && finalMatch.id === matchId;
  
  if (isFinal) {
    const reporterIsPlayer1 = matchSlot.player1?.id === reporterId;
    const reporterIsPlayer2 = matchSlot.player2?.id === reporterId;
    const soloPlayer = reporterIsPlayer1 ? matchSlot.player1 : reporterIsPlayer2 ? matchSlot.player2 : null;
    const opponent = reporterIsPlayer1 ? matchSlot.player2 : reporterIsPlayer2 ? matchSlot.player1 : null;

    if (soloPlayer && !opponent) {
      const createdAtMs = tournament.createdAt ? new Date(tournament.createdAt).getTime() : null;
      const THREE_MINUTES_MS = 6_000;
      const threeMinutesElapsed = createdAtMs ? Date.now() - createdAtMs >= THREE_MINUTES_MS : false;
      if (threeMinutesElapsed) {
        finalMatch.winner = soloPlayer;
        tournament.winner = soloPlayer;
        tournament.status = "completed";

        const matchDbId = await ensureVipMatch(finalMatch, tournamentId);
        finalMatch.matchId = matchDbId;
        let dbMatch = await dbcnx.getMatchById(matchDbId);
        if (!dbMatch) {
          dbMatch = new Match();
          dbMatch.id = matchDbId;
        }
        dbMatch.P1_Id = finalMatch.player1?.id || soloPlayer.id;
        dbMatch.P2_Id = finalMatch.player2?.id || null;
        dbMatch.count_players = 2;
        dbMatch.mode = 2;
        dbMatch.T_Id = tournamentId;
        const reporterId = soloPlayer.id;
        const reporterIsP1 = dbMatch.P1_Id === reporterId;
        dbMatch.score1 = reporterIsP1 ? 5 : 0;
        dbMatch.score2 = reporterIsP1 ? 0 : 5;
        dbMatch.Winner_Id = reporterId;
        dbMatch.gameStatus = "PLAYING";
        await dbcnx.updateMatch(dbMatch);

        const g = new GameState();
        g.id = matchDbId;
        g.P1_Id = dbMatch.P1_Id;
        g.P2_Id = dbMatch.P2_Id;
        g.T_Id = tournamentId;
        g.count_players = 2;
        g.mode = 2;
        g.gameStatus = "PLAYING";
        g.score1 = dbMatch.score1;
        g.score2 = dbMatch.score2;
        g.Winner_Id = reporterId;
        g.player1Name = g.P1_Id;
        g.player2Name = g.P2_Id ? g.P2_Id : null;
        matches.set(g.id, g);

        for (const semi of semifinals) {
          if (!semi || semi.winner) continue;
          const semiWinner = semi.player1 || semi.player2;
          if (!semiWinner) continue;
          const semiMatchId = await ensureVipMatch(semi, tournamentId);
          semi.matchId = semiMatchId;
          let semiDb = await dbcnx.getMatchById(semiMatchId);
          if (!semiDb) {
            semiDb = new Match();
            semiDb.id = semiMatchId;
          }
          semiDb.P1_Id = semi.player1?.id || semiWinner.id;
          semiDb.P2_Id = semi.player2?.id || null;
          semiDb.count_players = 2;
          semiDb.mode = 2;
          semiDb.T_Id = tournamentId;
          const semiWinnerIsP1 = semiDb.P1_Id === semiWinner.id;
          semiDb.score1 = semiWinnerIsP1 ? 5 : 0;
          semiDb.score2 = semiWinnerIsP1 ? 0 : 5;
          semiDb.Winner_Id = semiWinner.id;
          semiDb.gameStatus = "PLAYING";
          await dbcnx.updateMatch(semiDb);

          const sg = new GameState();
          sg.id = semiMatchId;
          sg.P1_Id = semiDb.P1_Id;
          sg.P2_Id = semiDb.P2_Id;
          sg.T_Id = tournamentId;
          sg.count_players = 2;
          sg.mode = 2;
          sg.gameStatus = "PLAYING";
          sg.score1 = semiDb.score1;
          sg.score2 = semiDb.score2;
          sg.Winner_Id = semiWinner.id;
          sg.player1Name = sg.P1_Id;
          sg.player2Name = sg.P2_Id ? sg.P2_Id : null;
          matches.set(sg.id, sg);
          semi.winner = semiWinner;
        }
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

  matchSlot.readyAt = matchSlot.readyAt || {};
  matchSlot.ready = matchSlot.ready || {};

  const reporterReadyAt = matchSlot.readyAt[reporterId];
  const reporterReady = Boolean(matchSlot.ready[reporterId]);
  if (!reporterReady || !reporterReadyAt) return; 

  const opponent = matchSlot.player1.id === reporterId ? matchSlot.player2 : matchSlot.player1;
  if (!opponent) return;
  const opponentReady = Boolean(matchSlot.ready[opponent.id]);
  if (opponentReady) return; 

  const diffMs = Date.now() - new Date(reporterReadyAt).getTime();
  if (diffMs < 6_000) return;

  matchSlot.winner = matchSlot.player1.id === reporterId ? matchSlot.player1 : matchSlot.player2;
  eliminateParticipant(tournament, opponent.id);

  const reporterIsP1 = matchSlot.player1.id === reporterId;
  const matchDbId = await ensureVipMatch(matchSlot, tournamentId);
  let dbMatch = await dbcnx.getMatchById(matchDbId);
  if (!dbMatch) {
    dbMatch = new Match();
    dbMatch.id = matchDbId;
  }
  dbMatch.P1_Id = matchSlot.player1.id;
  dbMatch.P2_Id = matchSlot.player2.id;
  dbMatch.count_players = 2;
  dbMatch.mode = 2;
  dbMatch.T_Id = tournamentId;
  dbMatch.score1 = reporterIsP1 ? 5 : 0;
  dbMatch.score2 = reporterIsP1 ? 0 : 5;
  dbMatch.Winner_Id = reporterId;
  dbMatch.gameStatus = "PLAYING";
  const g = new GameState();
  g.id = matchDbId;
  g.P1_Id = matchSlot.player1.id;
  g.P2_Id = matchSlot.player2.id;
  g.T_Id = tournamentId;
  g.count_players = 2;
  g.mode = 2;
  g.gameStatus = "PLAYING";
  g.score1 = dbMatch.score1;
  g.score2 = dbMatch.score2;
  g.Winner_Id = reporterId;
  g.player1Name = g.P1_Id;
  g.player2Name = g.P2_Id;
  matches.set(g.id, g);

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


const updateTournamentAfterMatch = async (gameState) => {
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
    semMatch.winner = winnerParticipant || { id: Winner_Id, name: Winner_Id };
    const p1Id = semMatch.player1?.id;
    const p2Id = semMatch.player2?.id;
    const loserId = Winner_Id === p1Id ? p2Id : p1Id;
    if (loserId) eliminateParticipant(tournament, loserId);

    if (tournament.final) {
      if (!tournament.final.player1) {
        tournament.final.player1 = semMatch.winner;
      } else if (!tournament.final.player2 && tournament.final.player1.id !== semMatch.winner.id) {
        tournament.final.player2 = semMatch.winner;
      }
      tournament.final.ready = {};
      if (tournament.final.player1 && tournament.final.player2) {
        tournament.final.matchId = null;
        tournament.status = "finals";

        const finalists = [tournament.final.player1, tournament.final.player2].filter(Boolean);
        for (const p of finalists) {
          const waiting = new GameState();
          waiting.waitingMatch = true;
          sendtoplayer(p.id, JSON.stringify(waiting));
        }
      }
    }
  } else if (finalMatch && finalMatch.matchId === gameState.id) {
    finalMatch.winner = winnerParticipant || { id: Winner_Id, name: Winner_Id };
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
    let data = JSON.stringify(ngame);
    sendtoplayer(ngame.P1_Id, data);
    sendtoplayer(ngame.P2_Id, data);
    sendtoplayer(ngame.P3_Id, data);
    sendtoplayer(ngame.P4_Id, data);
  }
};

const handelAlive = async(id) => {
  let res = await dbcnx.getOngoingMatch(id);
  if(!res)
  {
    let ngame = new GameState();
    ngame.id = -1;
    let data = JSON.stringify(ngame);
    sendtoplayer(id, data);
  }
};

async function handelRegister(request, id) {
  try {
    if (request.mode < 2 || request.mode > 4) 
      return;
    let ngame = new GameState();
    let m = await dbcnx.getOngoingMatch(id);
    if (!m) 
    {
      m = await dbcnx.getOpenRoom(request.mode);
      if (!m) {
        m = new Match();
        m.P1_Id = id;
        m.mode = request.mode;
        if (!request.tournement) 
          m.id = await dbcnx.createMatch_not(m);
        else 
          m.id = await dbcnx.createMatch(m);
      }
      else 
      {
        if (request.mode == 2) 
        {
          if (!m.P1_Id) 
            m.P1_Id = id;
          else if (!m.P2_Id) 
            m.P2_Id = id;
        }
        else
        {
          if (!m.P1_Id ) 
            m.P1_Id = id;
          else if (!m.P2_Id) 
            m.P2_Id = id;
          else if (!m.P3_Id) 
            m.P3_Id = id;
          else if (!m.P4_Id) 
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
    ngame.player1Name = null;
    ngame.player2Name = null;
    ngame.player3Name = null;
    ngame.player4Name = null;
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
    sendtoplayer(ngame.P1_Id, data);
    sendtoplayer(ngame.P2_Id, data);
    sendtoplayer(ngame.P3_Id, data);
    sendtoplayer(ngame.P4_Id, data);
  } catch (error) {
    console.error("Error in handelRegister for user:", id);
  }
}


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

const handelDup = async (connection,id) => {
  if (clients.has(id)) 
  {
    try {
      if (clients.get(id) != connection) 
      {
        clients.get(id).close();
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

fastify.get("/ws", { websocket: true }, async (connection, req) => {
  connection.on("message", async (msg) => {
   try
   {
     const request = JSON.parse(msg);
     if (!request || !request.token || !request.type) {
       console.log("Invalid message format, missing type:");
       return;
     }
     let token = request.token;
      if (token) {
        const mockReq = {
          headers: {
            authorization: `Bearer ${token}`
          },
          cookies: {}
        };
        let userData, res;
        if (request.type != 'MOVE')
        {
          res = await desToken(mockReq);
          if (res.status === 401) {
            connection.close();
            return;
          }
        }
        else
          res = tokens.get(token);
        userData = res;
        const id = userData.user_id;
        await handelDup(connection,id);
        clients.set(id, connection);
        if (request.type == "REGISTER") 
          await handelRegister(request,id);
        else if (request.type == "MOVE") 
          await handelMove(request,id);
        else if (request.type == "DELETE") 
          await handelRoomQuiiting(id);
        if (request.type == "ISALIVE") 
          await handelAlive(id);
        else if (request.type == "TOURNAMENT_CREATE") 
        {
          const creator = { id, name: id };
          createTournamentRoom(creator);
        }
        else if (request.type == "TOURNAMENT_LEAVE") 
        {
        const participant = { id, name: id };
        leaveTournamentRoom(request.tournamentId, participant);
        }
        else if (request.type == "TOURNAMENT_JOIN") {
          const participant = { id, name: id };
          joinTournamentRoom(request.tournamentId, participant);
        }
        else if (request.type == "TOURNAMENT_READY") {
          await handleTournamentReady(request.tournamentId, request.matchId, id);
        }
        else if (request.type == "TOURNAMENT_REPORT_MISSING") {
          await handleReportMissingOpponent(request.tournamentId, request.matchId, id);
        }
        else if (request.type == "REQUEST_TOURNAMENTS") {
          sendtoplayer(id, JSON.stringify({ type: "TOURNAMENTS_STATE", tournaments: Array.from(tournaments.values()) }));
        }
      }
      else 
      {
        console.log("No token provided, proceeding on Closing connection");
        connection.close();
      }
   }
   catch (e)
   {
      console.error("WebSocket message handler error");
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
          console.error("Server OnClosed Socket error:");
       }
      }
    }
  });
});

fastify.post('/invite', async (request, reply) => {
  try {
    const res = await desToken(request);
    
    if (res.status === 401) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
    let P1 = request.body.P1;
    let P2 = request.body.P2;
    let [m1, m2]= await Promise.all([dbcnx.getAvaiable(P1), dbcnx.getAvaiable(P2)]);
    if (!(m1 || m2))
    {
      let m = new Match();
      m.P1_Id = P1;
      m.P2_Id = P2;
      m.count_players = 2;
      await  dbcnx.createVIPMatch(m);
      return reply.code(201).send(JSON.stringify({ message: 'You Can Navigate' }));
    }
    else
    {
      let res= await dbcnx.getBoth(P1,P2);
      if (res)
        return reply.code(201).send(JSON.stringify({ message: 'You Can Navigate' }));
    }
    return reply.code(409).send(JSON.stringify({ message: 'You Cant Navigate' }));
  } catch (e) {
    return reply.code(405).send({ message: 'Error in Invite ' });
  }
});

fastify.post('/check', async (request, reply) => {
  try {
    const res = await desToken(request);
    if (res.status === 401) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
    const token =  res;
    const id = token.user_id;
    let m = await dbcnx.getAvaiable(id);
    if (m && m.mode != request.body.mode)
    {
      return reply.code(409).send({ message: 'Not Available' });
    }
    return reply.code(201).send({ message: 'Available' });
  } catch (e) {
    return reply.code(405).send({ message: "Error in checking"});
  }
});

fastify.post('/allmatch', async (request, reply) => {
  try {
    const res = await desToken(request);
    
    if (res.status === 401) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
    const token = res;
    const id = token.user_id;
    let matches = await dbcnx.getPlayerMatches(id);
      return reply.code(201).send({ matches: matches});
    } 
    catch (err) {
      return reply.code(401).send({ message: 'Invalid token' });
    }

});

fastify.get('/api/dashboard/:identifier', async (request, reply) => {
  try {
    const res = await desToken(request);
    if (res.status === 401) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
    const targetUserId = request.params.identifier;
    const matchesCount = await dbcnx.db.get(`SELECT count(*) as Played FROM Match 
      Where (P1_Id = ? OR P2_Id = ? OR P3_Id = ? OR P4_Id = ?);`, [targetUserId, targetUserId, targetUserId, targetUserId]);
    const winsCount = await dbcnx.UserCountWins(targetUserId);
    const lastMatch = await dbcnx.getLasttMatchByPlayerID(targetUserId);
    const totalMatches = matchesCount?.Played || 0;
    const totalWins = winsCount?.Winned || 0;
    const totalTournaments  = await dbcnx.UserCountTournPlayed(targetUserId);
    const totalTourWins = await dbcnx.UserCountTournWin(targetUserId);
    const winRate = totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(1) : 0;
    return {
      user: {
        id: null,
        email: null,
        User_name: null,
        avatar: null,
        isOnline: null,
        CreatedAt: null,
      },
      statistics: {
        totalMatches: totalMatches,
        totalWins: totalWins,
        totalLosses: totalMatches - totalWins,
        winRate: parseFloat(winRate),
        totalTournaments: totalTournaments ? totalTournaments.Played : 0,
        totalTourWins: totalTourWins ? totalTourWins.Winned  :  0,
      },
      lastMatch: lastMatch ? lastMatch :  null
    };
  } catch (error) {
    return reply.code(500).send({ message: 'Error in dashboard identifier' });
  }
});


const useHttps = process.env.USE_HTTPS === "true";
const port = 3000;

fastify.listen({ port, host: "0.0.0.0" });
console.log(`Game server listening on port ${port} (${useHttps ? 'HTTPS' : 'HTTP'})`);