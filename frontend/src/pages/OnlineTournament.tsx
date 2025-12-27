import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTournament, joinTournament, startTournament, getTournamentStatus, getWsUrl, setPlayerReady } from "@/lib/fgameTournament";
import { useAuth } from "@/context/AuthContext";
import { useWebSocket } from "@/hooks/useWebSocket";
import { toast } from "sonner";
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


  const [searchingAvailable, setSearchingAvailable] = useState(false);

  const token = useMemo(() => localStorage.getItem("token") || undefined, []);
  const currentUserId = useMemo(() => getUserIdFromToken(), []);
  const wsUrl = getWsUrl();
  const { ws, send, isReady } = useWebSocket(`ws://${import.meta.env.VITE_DOMAIN}:3000/ws`);
  const navigate = useNavigate();
  // const [features, setFeatures] = useState<Tournament[]>([]);
  const [availableTournaments, setAvailableTournaments] =useState<Tournament[]>([]);
  useEffect(() => {
    if (!ws || !isReady || (ws.readyState !== WebSocket.OPEN)) return;
    console.log("11177711Sending START message for Pong Online");

    ws.send(JSON.stringify({
        token:localStorage.getItem("token"),
        type: "GET_TOURNAMENTS"
    }));
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      // console.log("server saus 5=== ", data);
      if (data.type == "TOURNAMENTS_LIST")
      {
        console.log("TOURNAMENTS_LIST data:", data);
        setAvailableTournaments(() => { return data.tournaments;});
      }
      if (data.type == "redirect") {
        toast("Navigate to Play");
          navigate("/loading?mode=2");
        }
    };
    ws.addEventListener("message", handleMessage);
    return () => {
        ws.removeEventListener("message", handleMessage);
        // ws.close();
    };
}, [ws, isReady]);


  async function handleCreate(label) {
    if (!ws || !isReady || (ws.readyState !== WebSocket.OPEN)) {
      console.log("WebSocket not ready");
      return;
    };
    console.log("handleCreate tournament label:", token, label);
    // console.log("1188111Sending START message for Pong Online");

    ws.send(JSON.stringify({
        token:localStorage.getItem("token"),
      type: "CREATE_TOURNAMENT",
      label: label
    }));
  }

  async function handleJoin(id) {
    if (!ws || !isReady || (ws.readyState !== WebSocket.OPEN)) {
      console.log("WebSocket not ready");
      return;
    };
    console.log("Joining tournament id:", token, id);
    // console.log("11199911Sending START message for Pong Online");

    ws.send(JSON.stringify({
      token:localStorage.getItem("token"),
      type: "JOIN_TOURNAMENT",
      tournamentId: id
    }));
  }

  async function handleStart(id) {
    if (!ws || !isReady || (ws.readyState !== WebSocket.OPEN)) {
      console.log("WebSocket not ready");
      return;
    };
    console.log("handleStart tournament id:", token, id);
    // console.log("112223132111Sending START message for Pong Online");
    // console.log("11111989989Sending START message for Pong Online");

    ws.send(JSON.stringify({
        token:localStorage.getItem("token"),
      type: "START_TOURNAMENT",
      tournamentId: id
    }));
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
            <div className="flex items-end space-x-2">
              <Button onClick={() => handleCreate({label})} className="bg-gradient-primary">Create</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available tournaments list */}
      <Card className="bg-gradient-secondary border-border">
        <CardHeader>
          <CardTitle className="text-sm">Available Tournaments</CardTitle>
        </CardHeader>
        <CardContent>
          {searchingAvailable && <div className="text-muted-foreground">Searching for tournaments...</div>}
          {availableTournaments.length == 0 && <div className="text-muted-foreground">No tournaments found</div>}
          <div className="space-y-2">
            {availableTournaments.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <div className="font-semibold">#{t.id} {t.Label ? `- ${t.Label}` : ""}</div>
                  <div className="text-sm text-muted-foreground">{t.count_players ?? 0}/{t.max_players ?? 8} players • {t.result ?? "PENDING2"}</div>
                </div>
                <div className="space-x-2">
                  {t.max_players  == t.count_players  &&  <Button onClick={() => handleStart(t.id)}>START</Button>}
                  <Button onClick={() => handleJoin(t.id)} > Join </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
