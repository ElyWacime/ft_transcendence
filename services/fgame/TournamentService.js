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

  async create(label = "New Tournament", maxPlayers = 8) {
    const t = new Tournament();
    t.Label = label;
    t.max_players = Math.min(8, Math.max(2, maxPlayers));
    t.result = "PENDING";
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

    // Update count_players on Tournament
    const cnt = await this.db.db.get(`SELECT COUNT(*) as c FROM Participate_Tournament WHERE T_Id = ?`, [tId]);
    await this.db.db.run(`UPDATE Tournament SET count_players = ? WHERE id = ?`, [cnt.c, tId]);
    return { joined: true };
  }

  async start(tId) {
    const t = await this.db.getTournamentById(tId);
    if (!t) throw new Error("Tournament not found");
    const participants = await this.db.getParticipantsByTournamentId(tId);
    if (participants.length < 2) throw new Error("Need at least 2 players");

    const bracketSize = Math.min(t.max_players || 8, nextPowerOfTwo(participants.length));
    const seeds = participants.slice(0, bracketSize).map(p => p.id);

    // Round 1 pairings
    const round = 1;
    const pairings = [];
    for (let i = 0; i < seeds.length; i += 2) {
      const a = seeds[i] || null;
      const b = seeds[i + 1] || null;
      pairings.push([a, b]);
    }

    // Create matches for round 1
    for (const [a, b] of pairings) {
      const m = new Match();
      m.mode = 2;
      m.round = round;
      m.T_Id = tId;
      m.P1_Id = a;
      m.P2_Id = b;
      m.count_players = (a ? 1 : 0) + (b ? 1 : 0);
      m.gameStatus = m.count_players === 2 ? "PLAYING" : "PENDING";
      const matchId = await this.db.createMatch(m);
      m.id = matchId;
      await this.db.updateMatch(m);

      // Auto-advance byes
      if (a && !b) {
        m.Winner_Id = a;
        m.gameStatus = "FINISHED";
        await this.db.updateMatch(m);
      }
      if (!a && b) {
        m.Winner_Id = b;
        m.gameStatus = "FINISHED";
        await this.db.updateMatch(m);
      }
    }

    await this.db.db.run(`UPDATE Tournament SET result = 'PLAYING' WHERE id = ?`, [tId]);
    // Attempt immediate advancement in case of byes
    await this.advanceIfReady(tId);

    return { started: true };
  }

  async advanceIfReady(tId) {
    // Determine current highest round
    const rounds = await this.db.db.all(`SELECT DISTINCT round FROM Match WHERE T_Id = ? ORDER BY round ASC`, [tId]);
    if (rounds.length === 0) return;
    const maxRound = rounds[rounds.length - 1].round;

    // If all matches in maxRound are finished, create next round
    const currentMatches = await this.db.getMatchesByTournamentAndRound(tId, maxRound);
    if (!currentMatches.length) return;

    const allFinished = currentMatches.every(m => m.gameStatus === "FINISHED");
    if (!allFinished) return;

    const winners = currentMatches.map(m => m.Winner_Id).filter(Boolean);
    if (winners.length <= 1) {
      // Declare tournament winner
      const champ = winners[0] || null;
      await this.db.db.run(`UPDATE Tournament SET result = 'FINISHED', Winner_Id = ? WHERE id = ?`, [champ, tId]);
      return;
    }

    const nextRound = maxRound + 1;
    for (let i = 0; i < winners.length; i += 2) {
      const a = winners[i] || null;
      const b = winners[i + 1] || null;
      const m = new Match();
      m.mode = 2;
      m.round = nextRound;
      m.T_Id = tId;
      m.P1_Id = a;
      m.P2_Id = b;
      m.count_players = (a ? 1 : 0) + (b ? 1 : 0);
      m.gameStatus = m.count_players === 2 ? "PLAYING" : "PENDING";
      const matchId = await this.db.createMatch(m);
      m.id = matchId;
      await this.db.updateMatch(m);

      // Auto-advance byes if any
      if (a && !b) {
        m.Winner_Id = a;
        m.gameStatus = "FINISHED";
        await this.db.updateMatch(m);
      }
      if (!a && b) {
        m.Winner_Id = b;
        m.gameStatus = "FINISHED";
        await this.db.updateMatch(m);
      }
    }
  }

  async getStatus(tId) {
    const t = await this.db.getTournamentById(tId);
    const matches = await this.db.getTournamentMatches(tId);
    const participants = await this.db.getParticipantsByTournamentId(tId);
    return { tournament: t, matches, participants };
  }
}
