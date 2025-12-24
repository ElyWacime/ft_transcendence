import type { Tournament as UITournament, Player, Match } from "./api";

// Compute fgame base URL: prefer VITE_FGAME_URL, else VITE_DOMAIN:3000, else current host:3000
const FGAME_URL = (() => {
  const env: any = import.meta.env || {};
  const explicit = env.VITE_FGAME_URL as string | undefined;
  if (explicit) return explicit;
  const domain = env.VITE_DOMAIN as string | undefined;
  if (domain) return `http://${domain}:3000`;
  if (typeof window !== 'undefined') return `${window.location.protocol}//${window.location.hostname}:3000`;
  return 'http://localhost:3000';
})();

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

export async function setPlayerReady(tId: number, matchId: number, token?: string): Promise<any> {
  const res = await fetch(`${FGAME_URL}/api/tournaments/${tId}/match/${matchId}/ready`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to mark ready");
  return data;
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
      apiMatchId: m.id,
      p1Ready: m.P1_Ready ?? 0,
      p2Ready: m.P2_Ready ?? 0,
      stage: (m as any).stage || `Round ${m.round}`,
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
  if (FGAME_URL.startsWith('https://')) return `${FGAME_URL.replace('https://','wss://')}/ws`;
  if (FGAME_URL.startsWith('http://')) return `${FGAME_URL.replace('http://','ws://')}/ws`;
  return `${FGAME_URL}/ws`;
}
