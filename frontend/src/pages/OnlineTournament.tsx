import { useEffect, useMemo, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TournamentBracket } from "@/components/TournamentBracket";
import { api as mockApi, Tournament as UITournament, Match } from "@/lib/api";
import { createTournament, joinTournament, startTournament, getTournamentStatus, getWsUrl, setPlayerReady } from "@/lib/fgameTournament";
import { useAuth } from "@/context/AuthContext";
import { useWebSocket } from "@/hooks/useWebSocket";

// Helper to get user ID from JWT token
function getUserIdFromToken(): string | null {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.id || null;
  } catch (error) {
    return null;
  }
}

export default function OnlineTournament() {
  const { isLoggedIn } = useAuth();
  const [label, setLabel] = useState("My Cup");
  const [tournamentId, setTournamentId] = useState<number | null>(null);
  const [tournament, setTournament] = useState<UITournament | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoStarted, setAutoStarted] = useState(false);

  const token = useMemo(() => localStorage.getItem("token") || undefined, []);
  const currentUserId = useMemo(() => getUserIdFromToken(), []);
  const wsUrl = getWsUrl();
  const { send, isReady } = useWebSocket(wsUrl);

  // Auto-refresh tournament every 2 seconds
  useEffect(() => {
    if (!tournamentId) return;
    
    const interval = setInterval(async () => {
      try {
        const t = await getTournamentStatus(tournamentId);
        setTournament(t);

        // Auto-start game if both players are ready
        if (!autoStarted && t.matches) {
          for (const match of t.matches) {
            if (match.status === 'pending' && (match.p1Ready ?? 0) === 1 && (match.p2Ready ?? 0) === 1) {
              // Both ready, trigger game
              if (token && isReady) {
                setAutoStarted(true);
                send({ type: "REGISTER", token, mode: 2, tournamentId, matchId: match.apiMatchId });
                break;
              }
            }
          }
        }
      } catch (err) {
        console.error("Auto-refresh error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [tournamentId, token, isReady, autoStarted]);

  useEffect(() => {
    if (tournamentId !== null) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId]);

  async function handleCreate() {
    setLoading(true); setError(null);
    try {
      const id = await createTournament(label, 8);
      setTournamentId(id);
      await refresh();
    } catch (e: any) {
      setError(e.message);
    } finally { setLoading(false); }
  }

  async function handleJoin() {
    if (!tournamentId) return;
    setLoading(true); setError(null);
    try {
      await joinTournament(tournamentId, token);
      await refresh();
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }

  async function handleStart() {
    if (!tournamentId) return;
    setLoading(true); setError(null);
    try {
      await startTournament(tournamentId);
      await refresh();
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }

  async function refresh() {
    if (!tournamentId) return;
    try {
      const t = await getTournamentStatus(tournamentId);
      setTournament(t);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleReady(match: Match) {
    if (!tournamentId || !token || !match.apiMatchId) return;
    try {
      const result = await setPlayerReady(tournamentId, match.apiMatchId, token);
      console.log("Ready result:", result);
      await refresh();
    } catch (e: any) {
      setError(e.message);
    }
  }

  function onStartMatch(match: Match) {
    if (!tournamentId || !token) return;
    if (!isReady) {
      console.log("WS not ready yet");
    }
    send({ type: "REGISTER", token, mode: 2, tournamentId, matchId: match.apiMatchId });
  }

  return (
    <div className="container container-spaced space-y-6">
      <Card className="bg-gradient-secondary border-default">
        <CardHeader>
          <CardTitle className="font-game">Online Tournament</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md-grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted">Label</label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted">Tournament ID</label>
              <Input value={tournamentId ?? ""} onChange={(e) => setTournamentId(Number(e.target.value) || null)} placeholder="Enter ID to load" />
            </div>
            <div className="flex items-end space-x-2">
              <Button onClick={handleCreate} className="bg-gradient-primary">Create</Button>
              <Button onClick={handleJoin} disabled={!isLoggedIn || !tournamentId} className="bg-gradient-primary">Join</Button>
              <Button onClick={handleStart} disabled={!tournamentId || tournament?.status !== 'setup'} className="bg-gradient-primary">Start</Button>
              <Button variant="secondary" onClick={refresh} disabled={!tournamentId}>Refresh</Button>
            </div>
          </div>
          {error && <div className="text-destructive">{error}</div>}
          {loading && <div className="text-muted">Loading...</div>}
        </CardContent>
      </Card>

      {tournament && (
        <TournamentBracket 
          tournament={tournament} 
          onStartMatch={onStartMatch}
          onReady={handleReady}
          currentUserId={currentUserId || undefined}
        />
      )}
    </div>
  );
}
