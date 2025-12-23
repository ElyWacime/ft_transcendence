import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TournamentBracket } from "@/components/TournamentBracket";
import { api as mockApi, Tournament as UITournament, Match } from "@/lib/api";
import { createTournament, joinTournament, startTournament, getTournamentStatus, getWsUrl } from "@/lib/fgameTournament";
import { useAuth } from "@/context/AuthContext";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function OnlineTournament() {
  const { isLoggedIn } = useAuth();
  const [label, setLabel] = useState("My Cup");
  const [tournamentId, setTournamentId] = useState<number | null>(null);
  const [tournament, setTournament] = useState<UITournament | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = useMemo(() => localStorage.getItem("token") || undefined, []);
  const wsUrl = getWsUrl();
  const { send, isReady } = useWebSocket(wsUrl);

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

  function onStartMatch(match: Match) {
    if (!tournamentId || !token) return;
    if (!isReady) {
      console.log("WS not ready yet");
    }
    send({ type: "REGISTER", token, mode: 2, tournamentId });
  }

  return (
    <div className="container mx-auto px-4 py-20 space-y-6">
      <Card className="bg-gradient-secondary border-border">
        <CardHeader>
          <CardTitle className="font-game">Online Tournament</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Label</label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Tournament ID</label>
              <Input value={tournamentId ?? ""} onChange={(e) => setTournamentId(Number(e.target.value) || null)} placeholder="Enter ID to load" />
            </div>
            <div className="flex items-end space-x-2">
              <Button onClick={handleCreate} className="bg-gradient-primary">Create</Button>
              <Button onClick={handleJoin} disabled={!isLoggedIn || !tournamentId} className="bg-gradient-primary">Join</Button>
              <Button onClick={handleStart} disabled={!tournamentId} className="bg-gradient-primary">Start</Button>
              <Button variant="secondary" onClick={refresh} disabled={!tournamentId}>Refresh</Button>
            </div>
          </div>
          {error && <div className="text-destructive">{error}</div>}
          {loading && <div className="text-muted-foreground">Loading...</div>}
        </CardContent>
      </Card>

      {tournament && (
        <TournamentBracket tournament={tournament} onStartMatch={onStartMatch} />
      )}
    </div>
  );
}
