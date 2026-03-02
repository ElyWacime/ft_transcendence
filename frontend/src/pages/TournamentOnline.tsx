import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import "../css/tournament-online.css";
import { decodeJWT } from "@/lib/jwt-utils";
import { useWebSocket } from "@/context/WebSocketContext";

// game-service base URL (used for initial tournament snapshot fetch before sockets sync)
// sockets keep the page live, but we still seed the UI with the latest known state on first load
const API_URL = `http://${import.meta.env.VITE_DOMAIN}:3000`;

interface Participant {
  id: string;
  name: string;
}

interface MatchSlot {
  id: string;
  player1: Participant | null;
  player2: Participant | null;
  winner: Participant | null;
  ready?: Record<string, boolean>;
  matchId?: number | null;
  ready_at: Date | null;
  readyAt?: Record<string, string>;
}

interface Tournament {
  id: string;
  active: boolean;
  createdBy: string | null;
  createdByName: string | null;
  createdAt: string | null;
  participants: Participant[];
  full: boolean;
  status?: "waiting" | "semifinals" | "finals" | "completed";
  semifinals?: MatchSlot[];
  final?: MatchSlot | null;
  winner?: Participant | null;
}

interface CurrentUser {
  id: string;
  name: string;
}

export default function TournamentOnlinePage() {
  const navigate = useNavigate();
  const { ws, isReady } = useWebSocket();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isConnected = isReady && ws?.readyState === WebSocket.OPEN;

  // derive current user from stored JWT so we can personalize joins/ready buttons
  // this keeps the page purely client-side; no extra auth fetch round-trip just to know who we are
  const token = localStorage.getItem("token");
  const decoded = token ? decodeJWT(token) : null;
  const currentUser: CurrentUser | null = decoded
    ? { id: decoded.id, name: decoded.name || decoded.email || "You" }
    : null;

  const myTournamentId = useMemo(() => {
    if (!currentUser) return null;
    const t = tournaments.find((tour) => tour.participants?.some((p) => p.id === currentUser.id));
    return t?.id || null;
  }, [tournaments, currentUser]);



useEffect(() => {

   const checkIfaAlayerIsLate = async () => {
      if (tournaments.semifinals && !Array.isArray(tournaments) && tournaments.status !== "finals")
      {
        const dateNow = new Date();
        if (tournaments.semifinals[0].ready_at)
        {
          const diff = Math.abs(dateNow.getTime() - new Date(tournaments.semifinals[0].ready_at).getTime());
           const minutes = Math.floor((diff / (1000 * 60)) % 60);
           if (minutes <61)
           {
            // make them both ready.. by the name of low!
            markReady(tournaments.id, tournaments.semifinals[0].id);
           }
        }
      }
    }
     const intervalId = setInterval(checkIfaAlayerIsLate, 1000);
   return () => clearInterval(intervalId);
}, []);
  // initial load: fetch tournament list from game-service REST endpoint
  // REST gives us a snapshot even if websocket connects a tick later or user refreshes mid-flow
  useEffect(() => {

   
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/tournaments-online`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          console.log("data>>>>>", data);
          setTournaments(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error("Failed to load tournaments", e);
        toast.error("Could not load tournaments");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // websocket handler: live tournament state + match-ready cues
  // TOURNAMENTS_STATE keeps cards updated; TOURNAMENT_MATCH_READY tells players to jump into their match
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "TOURNAMENTS_STATE") {
          setTournaments(Array.isArray(data.tournaments) ? data.tournaments : []);
        }
        if (data.type === "TOURNAMENT_MATCH_READY") {
          const isPlayer =
            data.player1?.id === currentUser?.id || data.player2?.id === currentUser?.id;
          if (isPlayer) {
            // toast.success("Your tournament match is ready! Redirecting to the arena...");
            navigate(`/loading?mode=2`);
          }
        }
      } catch (e) {
        console.error("Failed to parse WS message", e);
      }
    },
    [currentUser, navigate]
  );

  // register websocket listener and request current tournaments once socket is open
  // we proactively request a snapshot so late-joiners still get the latest state even if no broadcast fires
  useEffect(() => {
    if (!ws || !isReady || ws.readyState !== WebSocket.OPEN) return;
    ws.addEventListener("message", handleMessage);
    ws.send(
      JSON.stringify({
        type: "REQUEST_TOURNAMENTS",
        token: localStorage.getItem("token"),
      })
    );
    return () => ws.removeEventListener("message", handleMessage);
  }, [ws, isReady, handleMessage]);

  // helper to send authed websocket actions to game-service
  // all tournament mutations (create/join/ready) flow through the existing WS channel used by gameplay
  const sendAction = (payload: Record<string, unknown>) => {
    if (!ws || !isReady || ws.readyState !== WebSocket.OPEN) {
      toast.error("Socket not connected");
      return false;
    }
    ws.send(JSON.stringify({ token: localStorage.getItem("token"), ...payload }));
    return true;
  };

  // create a new online tournament (server adds creator as first participant)
  // if socket is down we bail fast to avoid confusing UX
  const createTournament = () => {
    if (!currentUser) {
      toast.error("Login to create a tournament");
      return;
    }
    setIsSubmitting(true);
    const ok = sendAction({ type: "TOURNAMENT_CREATE" });
    if (ok) toast.success("Tournament created. Waiting for players...");
    setIsSubmitting(false);
  };


  //leave the tournament you're currently in; if you're the last one, the tournament is deleted
  const leaveTournament = (tournamentId: string) => {
    
    if (!currentUser) {
      toast.error("Login to leave a tournament");
      return;
    }
    setIsSubmitting(true);
    const ok = sendAction({ type: "TOURNAMENT_LEAVE", tournamentId });
    if (ok) toast.success("Left tournament successfully");
    setIsSubmitting(false);
    

    }
  // join an existing tournament; server tracks bracket slots and will broadcast updated participant list
  const joinTournament = (tournamentId: string) => {
    if (!currentUser) {
      toast.error("Login to join a tournament");
      return;
    }
    setIsSubmitting(true);
    const ok = sendAction({ type: "TOURNAMENT_JOIN", tournamentId });
    if (ok) toast.success("Joined tournament");
    setIsSubmitting(false);
  };

  // mark current user ready for their bracket match; once both ready, server triggers match-ready event
  // client doesn’t navigate immediately; it waits for the server-issued TOURNAMENT_MATCH_READY payload
  const markReady = (tournamentId: string, matchId: string) => {
    setIsSubmitting(true);
    const ok = sendAction({ type: "TOURNAMENT_READY", tournamentId, matchId });
    if (ok) toast.success("Ready! Waiting for opponent...");
    setIsSubmitting(false);
  };

  const reportMissing = (tournamentId: string, matchId: string) => {
    if (!currentUser) {
      toast.error("Login to report a missing opponent");
      return;
    }
    setIsSubmitting(true);
    const ok = sendAction({ type: "TOURNAMENT_REPORT_MISSING", tournamentId, matchId });
    if (ok) toast.message("Reported. If they stay unready for 5 minute, you'll advance.");
    setIsSubmitting(false);
  };

  // render a single tournament card (participants, bracket, ready buttons)
  // keeps UI logic colocated so both semifinals and final sections read from the same Tournament shape
  const renderTournamentCard = (t: Tournament) => {
    const status = t.status || (t.full ? "semifinals" : "waiting");
    const statusLabel = (() => {
      if (status === "completed") return t.winner ? `Winner: ${t.winner.name}` : "Completed";
      if (t.full) return "Full (4 players)";
      return `${t.participants.length}/4 joined`;
    })();
    const iAmInside = myTournamentId === t.id;

    return (
      <div key={t.id} className="tournament-card">
        <div className="tournament-header">
          <div>
            <h2>Online Tournament</h2>
            <p className="muted">Created by {t.createdByName ?? "Unknown"}</p>
          </div>
          <span className={`status-pill ${t.full ? "full" : "active"}`}>{statusLabel}</span>
        </div>

        <div className="tournament-state">
          <div>
            <p className="label">Created at</p>
            <p className="value">{t.createdAt ? new Date(t.createdAt).toLocaleString() : "-"}</p>
          </div>
        </div>

        <div className="participants">
          <div className="participants-header">
            <p className="label">Participants ({t.participants.length}/4)</p>
            {t.full && <span className="pill full">Full</span>}
          </div>
          <div className="participants-list">
            {t.participants.length === 0 ? (
              <p className="muted">No players yet.</p>
            ) : (
              t.participants.map((p, idx) => (
                <div key={p.id} className="participant">
                  <span className="badge">{idx + 1}</span>
                  <span className="name">{p.name}</span>

                </div>
                // <button>

                // <button/>
              ))
            )}
          </div>
        </div>

        <div className="bracket">
          <p className="label">Bracket</p>
          <div className="bracket-section">
            <p className="muted">Semifinals</p>
            {(t.semifinals ?? []).map((m) => (
              <div key={m.id} className="participant">
                {/* <span className="badge">{m.id}</span> */}
                <span className="name">
                  {(m.player1?.name || "?")} vs {(m.player2?.name || "?")}
                </span>
                {m.winner && <span className="pill full">Winner: {m.winner.name}</span>}
                {currentUser && [m.player1?.id, m.player2?.id].includes(currentUser.id) && (
                  <button
                    className="ghost"
                    disabled={isSubmitting || m.ready?.[currentUser.id] || !iAmInside}
                    onClick={() => markReady(t.id, m.id)}
                  >
                    {m.ready?.[currentUser.id] ? "ready" : "Ready"}
                  </button>
                )}
                {currentUser && [m.player1?.id, m.player2?.id].includes(currentUser.id) && (
                  <button
                 title="Report your opponent as missing if they don't show up. If they remain unready for 5 minutes, you'll automatically advance to the next round."
                  className="primary"

                    // className="ghost"
                    disabled={isSubmitting || !m.ready?.[currentUser.id] || !iAmInside || t.status == "completed" }
                    onClick={() => reportMissing(t.id, m.id)}
                  >
                    Report
                  </button>
                )}
              </div>
            ))}
            {(t.semifinals ?? []).length === 0 && <p className="muted">Waiting for 4 players...</p>}
          </div>

          <div className="bracket-section">
            <p className="muted">Final</p>
            <div className="participant">
              <span className="badge">Final</span>
              <span className="name">
                {(t.final?.player1?.name || "?")} vs {(t.final?.player2?.name || "?")}
              </span>
              {t.final?.winner && <span className="pill full">Winner: {t.final.winner.name}</span>}
              {currentUser && [t.final?.player1?.id, t.final?.player2?.id].includes(currentUser.id) && (
                <button
                  className="ghost"
                  disabled={isSubmitting || t.final?.ready?.[currentUser.id]}
                  onClick={() => markReady(t.id, t.final?.id || "final")}
                >
                  {t.final?.ready?.[currentUser.id] ? "ready" : "Ready"}
                </button>
              )}
              {currentUser && [t.final?.player1?.id, t.final?.player2?.id].includes(currentUser.id) && (
                <button
                  className="primary"
                  title="Report your opponent as missing if they don't show up. If they remain unready for 5 minutes, you'll automatically advance to the next round."
                  // className="ghost"
                  disabled={isSubmitting ||  !iAmInside || t.status == "completed" }
                  onClick={() => reportMissing(t.id, t.final?.id || "final")}
                >
                  Report
                </button>
              )}
            </div>
          </div>

          <div className="bracket-section">
            <p className="muted">Tournament Winner</p>
            <div className="participant">
              <span className="badge">🏆</span>
              <span className="name">{t.winner?.name || "TBD"}</span>
            </div>
          </div>
        </div>

        <div className="tournament-actions">

        <button className="ghost"
         onClick={() => leaveTournament(t.id)}
          disabled={
            !iAmInside ||
            isSubmitting ||
            (!isConnected) ||
            (t.full && t.status !== "completed")
          }
          >leave
        </button>
          <button
            className="ghost"
            onClick={() => joinTournament(t.id)}
            disabled={
              isSubmitting ||
              !isConnected ||
              t.full ||
              Boolean(myTournamentId) ||
              iAmInside 
            }
          >
            {t.full ? "Full" : iAmInside ? "You're in" : "Join"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="tournament-page">
      <div className="tournament-list">
        <div className="tournament-card create-card">
          <div className="tournament-actions page-actions">
            <button
              className="primary"
              onClick={createTournament}
              disabled={isSubmitting || !isConnected || Boolean(myTournamentId)}
            >
              Create tournament
            </button>
            {myTournamentId && <span className="muted">You are already in a tournament.</span>}
          </div>  
        </div>
        {isLoading ? (
          <p className="muted">Loading tournaments...</p>
        ) : tournaments.length === 0 ? (
          <p className="muted">No tournaments yet. Create one to start.</p>
        ) : (
          tournaments.map((t) => renderTournamentCard(t))
        )}

        {!isConnected && (
          <p className="muted warning">Live updates unavailable (socket disconnected).</p>
        )}
      </div>
    </div>
  );
}





