import { Tournament, Participate_Tournament, Match } from "./DBController.js";

function nextPowerOfTwo(n) {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

export class TournamentService {
  constructor(db) {
    this.db = db;
  }

  async create(label = "New Tournament", maxPlayers = 4) {
    const t = new Tournament();
    t.Label = label;
    // t.max_players = 4;
    // this.count_players = 0;
    // t.result = "PENDING";
    const id = await this.db.createTournament(t);
    return id;
  }

  async join(tId, userId) {
    // Check if user is already in an active tournament (not FINISHED)
    const activeTournament = await this.db.db.get(`
      SELECT T.id, T.Label 
      FROM Participate_Tournament PT 
      INNER JOIN Tournament T ON T.id = PT.T_Id 
      WHERE PT.P_Id = ? AND T.result != 'FINISHED'
    `, [userId]);
    
    if (activeTournament && activeTournament.id !== tId) {
      return { joined: false, reason: "already_in_tournament", tournamentId: activeTournament.id, tournamentName: activeTournament.Label };
    }

    // Prevent duplicate joins
    const existing = await this.db.db.get(`SELECT 1 FROM Participate_Tournament WHERE T_Id = ? AND P_Id = ?`, [tId, userId]);
    if (existing) return { joined: false, reason: "already_joined" };

    const p = new Participate_Tournament();
    p.P_Id = userId;
    p.T_Id = tId;
    await this.db.createParticipate(p);

    // Update count_players on Tournament console.log("Trying To INSERT ", tId);
    // const cnt = await this.db.db.get(`SELECT COUNT(*) as c FROM Participate_Tournament WHERE T_Id = ?`, [tId]);
    // await this.db.db.run(`UPDATE Tournament SET count_players = ? WHERE id = ?`, [cnt.c, tId]);
    return { joined: true };
  }

  async start(tId) {
    console.log("\n\nTrying To INSERT ", tId);
    const t = await this.db.getTournamentById(tId);
    console.log("\n\ngetTournamentById ");
    if (!t) throw new Error("Tournament not found");
    
    // Prevent re-starting already started tournaments
    if (t.result === 'PLAYING' || t.result === 'FINISHED') {
      throw new Error("Tournament already started");
    }
    const participants = await this.db.getParticipantsByTournamentId(tId);
    console.log("\n\ngetParticipantsByTournamentId");
    
    // Validate: must have 2, 4, 6, or 8 players (power of 2)
    const validCounts = 4;
    if (validCounts !== participants.length) {
      throw new Error(`Tournament requires 4 players. Currently ${participants.length} participants.`);
    }

    // const bracketSize = Math.min(t.max_players || 4, participants.length);
    // const seeds = participants.slice(0, bracketSize).map(p => p.id);

    // Round 1 pairings
    const round = 1;
    // const pairings = [];
    // for (let i = 0; i < participants.length; i += 2) {
    //   const a = participants[i];
    //   const b = participants[i + 1] ;
    //   pairings.push([a, b]);
    // }
    // console.log("\n\nfor 1");
    // // Create matches for round 1
    // for (const [a, b] of pairings) {

    // }
    console.log("\n\nparticipants", participants);
    let m = new Match();
    m.round = round;
    m.T_Id = tId;
    m.P1_Id = participants[0].id;
    m.P2_Id = participants[1].id;
    m.count_players = 2;
    m.gameStatus = "PENDING";
    console.log("\n\nCreating Match for ", m);
    let matchId = await this.db.createMatch(m);
    console.log("\n\ncreateMatch");
    m.id = matchId;
    await this.db.updateMatch(m);
    console.log("\n\nupdateMatch");

    m = new Match();
    m.round = round;
    m.T_Id = tId;
    m.P1_Id = participants[2].id;
    m.P2_Id = participants[3].id;
    m.count_players = 2;
    m.gameStatus = "PENDING";
    console.log("\n\nCreating Match for2 ", m);
    matchId = await this.db.createMatch(m);
    console.log("\n\ncreateMatch2");
    m.id = matchId;
    await this.db.updateMatch(m);
    console.log("\n\nupdateMatch2");





    await this.db.db.run(`UPDATE Tournament SET result = 'PLAYING' WHERE id = ?`, [tId]);
    console.log("\n\nthis.db.db.run");
    await this.advanceIfReady(tId);
    console.log("\n\nadvanceIfReady");

    return { started: true };
  }

  async advanceIfReady(tId) {
    const winners = await this.db.db.all(
      `SELECT Winner_Id FROM Match WHERE T_Id = ? AND round = 1`,
      [tId]
    );
  
    // Not enough matches yet
    if (winners.length < 2) return;
  
    // If any winner is NULL, stop
    if (!winners.every(w => w.Winner_Id)) {
      console.log("Waiting for all winners...");
      return;
    }
  
    console.log("Winners ready:", winners);
  
    const [a, b] = winners.map(w => w.Winner_Id);
  
    const m = new Match();
    m.round = 2;
    m.T_Id = tId;
    m.P1_Id = a;
    m.P2_Id = b;
    m.count_players = 2;
    m.gameStatus = "PENDING";
  
    const matchId = await this.db.createMatch(m);
    m.id = matchId;
    await this.db.updateMatch(m);
  
    console.log("Final match created");
  }
  
  async getStatus(tId) {
    const t = await this.db.getTournamentById(tId);
    const matches = await this.db.getTournamentMatches(tId);
    const participants = await this.db.getParticipantsByTournamentId(tId);
    
    // Calculate stage names based on total participants and current round
    const totalRounds = Math.log2(participants.length);
    const stageNames = {
      1: participants.length === 2 ? "Final" : "Round 1",
      2: "Semi-Final",
      3: "Quarter-Final"
    };
    
    return { 
      tournament: t, 
      matches: matches.map(m => ({ ...m, stage: stageNames[m.round] || `Round ${m.round}` })), 
      participants,
      totalRounds
    };
  }

  async setPlayerReady(tId, matchId, playerId) {
    const match = await this.db.getMatchById(matchId);
    if (!match || match.T_Id !== tId) throw new Error("Match not found in tournament");
    if (match.gameStatus !== "PENDING") throw new Error("Match not in PENDING state");

    if (match.P1_Id === playerId) {
      match.P1_Ready = 1;
    } else if (match.P2_Id === playerId) {
      match.P2_Ready = 1;
    } else {
      throw new Error("Player not in this match");
    }

    await this.db.db.run(`UPDATE Match SET P1_Ready=?, P2_Ready=? WHERE id=?`, 
      [match.P1_Ready, match.P2_Ready, matchId]);
    
    return { ready: true, bothReady: match.P1_Ready && match.P2_Ready };
  }
}
