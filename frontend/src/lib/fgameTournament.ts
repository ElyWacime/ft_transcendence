import type { Tournament as UITournament, Player, Match } from "./api";

// Default to 3000 to match docker-compose mapping; can override via VITE_FGAME_URL
const FGAME_URL = import.meta.env.VITE_FGAME_URL || "http://localhost:3000";

export async function createTournament(label: string, maxPlayers = 8): Promise<number> {
  const res = await fetch(`${FGAME_URL}/api/tournaments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label, maxPlayers }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create tournament");
  return data.id as number;
}

export async function joinTournament(id: number, token?: string): Promise<any> {
  const res = await fetch(`${FGAME_URL}/api/tournaments/${id}/join`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to join tournament");
  return data;
}

export async function startTournament(id: number): Promise<any> {
  const res = await fetch(`${FGAME_URL}/api/tournaments/${id}/start`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to start tournament");
  return data;
}

export async function getTournamentStatus(id: number): Promise<UITournament> {
  const res = await fetch(`${FGAME_URL}/api/tournaments/${id}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to get tournament");
  return mapToUITournament(json);
}

function mapToUITournament(api: any): UITournament {
  const t = api.tournament;
  const participants = api.participants || [];
  const matches = api.matches || [];

  const players: Player[] = participants.map((u: any) => ({
    id: u.id,
    alias: u.User_name,
    score: 0,
    wins: 0,
    losses: 0,
  }));

  const playerById = new Map(players.map(p => [p.id, p]));

  const uiMatches: Match[] = matches.map((m: any) => {
    const p1 = m.P1_Id ? (playerById.get(m.P1_Id) || { id: m.P1_Id, alias: m.P1_Id, score: 0, wins: 0, losses: 0 }) : { id: "TBD1", alias: "TBD", score: 0, wins: 0, losses: 0 };
    const p2 = m.P2_Id ? (playerById.get(m.P2_Id) || { id: m.P2_Id, alias: m.P2_Id, score: 0, wins: 0, losses: 0 }) : { id: "TBD2", alias: "TBD", score: 0, wins: 0, losses: 0 };
    const statusMap: Record<string, Match["status"]> = { PENDING: "pending", PLAYING: "playing", FINISHED: "completed" };
    const status = statusMap[m.gameStatus] || "pending";
    const winner = m.Winner_Id ? playerById.get(m.Winner_Id) : undefined;
    return {
      id: `match-${m.id}`,
      player1: p1,
      player2: p2,
      winner,
      score1: m.score1 ?? 0,
      score2: m.score2 ?? 0,
      status,
      round: m.round ?? 1,
    };
  });

  const statusMapT: Record<string, UITournament["status"]> = { PENDING: "setup", PLAYING: "active", FINISHED: "completed" };
  const uiTournament: UITournament = {
    id: String(t.id),
    name: t.Label,
    players,
    matches: uiMatches,
    status: statusMapT[t.result] || "setup",
    winner: t.Winner_Id ? playerById.get(t.Winner_Id) : undefined,
  };

  return uiTournament;
}

export function getWsUrl() {
  const url = (FGAME_URL.startsWith("http")) ? FGAME_URL.replace(/^http/, "ws") : FGAME_URL;
  return `${url}/ws`;
}
