import { useEffect, useMemo, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTournament, joinTournament, startTournament, getTournamentStatus, getWsUrl, setPlayerReady } from "@/lib/fgameTournament";
import { useAuth } from "@/context/AuthContext";
import { useWebSocket } from "@/hooks/useWebSocket";
// import { useNavigate } from "react-router-dom";
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
type Tournament = {
  id: number;
  Label: string;
  CreatedAt: string | Date;
  count_players: number;
  max_players: number;
  result: string;
  Winner_Id: number | null;
};
export default function OnlineTournament() {
  const { isLoggedIn } = useAuth();
  const [label, setLabel] = useState("My Cup");
  const [tournamentId, setTournamentId] = useState<number | null>(null);
  const [tournament, setTournament] = useState<UITournament | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoStarted, setAutoStarted] = useState(false);

  const [availableTournaments, setAvailableTournaments] = useState<UITournament[]>([]);
  const [searchingAvailable, setSearchingAvailable] = useState(false);

  const token = useMemo(() => localStorage.getItem("token") || undefined, []);
  const currentUserId = useMemo(() => getUserIdFromToken(), []);
  const wsUrl = getWsUrl();
  const { ws, send, isReady } = useWebSocket(`ws://${import.meta.env.VITE_DOMAIN}:3000/ws`);

  const [features, setFeatures] = useState<Tournament[]>([]);
  useEffect(() => {
    if (!ws || !isReady) return;
    ws.send(JSON.stringify({
        token:localStorage.getItem("token"),
        type: "GET_TOURNAMENTS"
    }));
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type == "TOURNAMENTS_LIST")
        setFeatures(() => { return data.tournaments;});
    };
    ws.addEventListener("message", handleMessage);
    return () => {
        // if (ws.readyState === WebSocket.OPEN) {
        //     ws.send(JSON.stringify({
        //         token:localStorage.getItem("token"),
        //         type: "DELETE",
        //     }));
        // }
        ws.removeEventListener("message", handleMessage);
        // ws.close();
    };
}, [ws, isReady]);

  // Search sequentially from 1 until an id doesn't exist (stop on first missing), max cap to avoid infinite loop
  // const listAvailableTournaments = useCallback(async (opts?: { auto?: boolean }) => {
  //   if (searchingAvailable) return;
  //   setSearchingAvailable(true);
  //   setError(null);
  //   const found: UITournament[] = [];
  //   try {
  //     let id = 1;
  //     const MAX_ATTEMPTS = 1000; // safety cap
  //     while (id <= MAX_ATTEMPTS) {
  //       try {
  //         const t = await getTournamentStatus(id);
  //         if (!t) {
  //           // stop on missing
  //           break;
  //         }
  //         found.push(t);
  //         id++;
  //       } catch (e) {
  //         // stop when an ID is missing / not found
  //         break;
  //       }
  //     }
  //   } catch (e: any) {
  //     setError(e.message || "Failed to list tournaments");
  //   } finally {
  //     setAvailableTournaments(found);
  //     setSearchingAvailable(false);
  //   }
  // }, [searchingAvailable]);
  
  // Run a background search once on mount to populate list
  // useEffect(() => {
  //   ws.send({ type: "Authenticated", token:localStorage.getItem("token")});
  //   listAvailableTournaments({ auto: true });
  // }, []);

  // // Auto-refresh tournament every 2 seconds
  // useEffect(() => {
  //   if (!tournamentId) return;
    
  //   const interval = (async () => {
  //     try {
  //       const t = await getTournamentStatus(tournamentId);
  //       setTournament(t);

  //       // Auto-start game if both players are ready
  //       if (!autoStarted && t.matches) {
  //         for (const match of t.matches) {
  //           if (match.status === 'pending' && (match.p1Ready ?? 0) === 1 && (match.p2Ready ?? 0) === 1) {
  //             // Both ready, trigger game
  //             if (token && isReady) {
  //               setAutoStarted(true);
  //               send({ type: "REGISTER", token, mode: 2, tournamentId, matchId: match.apiMatchId });
  //               break;
  //             }
  //           }
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Auto-refresh error:", err);
  //     }
  //   });

  //   return () => clearInterval(interval);
  // }, [tournamentId, token, isReady, autoStarted]);

  // useEffect(() => {
  //   if (tournamentId !== null) {
  //     refresh();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tournamentId]);

  // async function handleCreate() {
  //   // setLoading(true); setError(null);
  //   try {
  //     const id = await createTournament(label, 8);
  //     setTournamentId(id);
  //     await refresh();
  //     await listAvailableTournaments();
  //   } catch (e: any) {
  //     setError(e.message);
  //   } finally { setLoading(false); }
  // }

  // async function handleJoin() {
  //   if (!tournamentId) return;
  //   // setLoading(true); setError(null);
  //   try {
  //     await joinTournament(tournamentId, token);
  //     await refresh();
  //     await listAvailableTournaments();
  //   } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  // }

  // async function handleStart() {
  //   if (!tournamentId) return;
  //   // setLoading(true);
  //   // setError(null);
  //   try {
  //     await startTournament(tournamentId);
  //     // await refresh();
  //   } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  // }

  // async function refresh() {
  //   if (!tournamentId) return;
  //   try {
  //     const t = await getTournamentStatus(tournamentId);
  //     setTournament(t);
  //   } catch (e: any) {
  //     setError(e.message);
  //   }
  // }
  // return (<></>);





  async function handleCreate() {

  }

  async function handleJoin() {

  }

  async function handleStart() {

  }

  return(
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
              <Input
                value={tournamentId ?? ""}
                onChange={(e) => setTournamentId(e.target.value === "" ? null : Number(e.target.value))}
                placeholder="Enter ID to load"
              />
            </div>
            <div className="flex items-end space-x-2">
              <Button onClick={handleCreate} className="bg-gradient-primary">Create</Button>
              <Button onClick={handleJoin} className="bg-gradient-primary">Join</Button>
              <Button onClick={handleStart} className="bg-gradient-primary">Start</Button>
            </div>
          </div>
          {/* {error && <div className="text-destructive">{error}</div>}
          {loading && <div className="text-muted-foreground">Loading...</div>} */}
        </CardContent>
      </Card>

      {/* Available tournaments list */}
      <Card className="bg-gradient-secondary border-border">
        <CardHeader>
          <CardTitle className="text-sm">Available Tournaments</CardTitle>
        </CardHeader>
        <CardContent>
          {searchingAvailable && <div className="text-muted-foreground">Searching for tournaments...</div>}
          {!searchingAvailable && availableTournaments.length === 0 && <div className="text-muted-foreground">No tournaments found</div>}
          <div className="space-y-2">
            {availableTournaments.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <div className="font-semibold">#{t.id} {t.Label ? `- ${t.Label}` : ""}</div>
                  <div className="text-sm text-muted-foreground">{t.count_players ?? 0}/{t.max_players ?? 8} players • {t.status ?? "unknown"}</div>
                </div>
                <div className="space-x-2">
                  <Button
                    onClick={async () => {
                      setTournamentId(t.id);
                      // setLoading(true);
                      try {
                        await joinTournament(t.id, token);
                        await refresh();
                        await listAvailableTournaments();
                      } catch (e: any) {
                        setError(e.message);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={!isLoggedIn || (t.max_players && (t.count_players ?? 0) >= t.max_players)}
                  >
                    Join
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
