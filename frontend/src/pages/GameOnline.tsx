import { useLocation, useNavigate } from "react-router-dom";
import { PongCanvasOnline } from "@/components/PongCanvasOnline";
import { useEffect } from "react";
// import { useWebSocket } from "../hooks/useWebSocket";
import { toast } from "sonner";
import { useWebSocket } from "@/context/WebSocketContext";

interface GameOnlineProps {
  player1Name: string;
  player2Name: string;
  player3Name: string;
  player4Name: string;
  mode: number;
  matchId:number
}

const GameOnline = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const state = location.state as GameOnlineProps;
  if(!state)
      return null;
  const { player1Name, player2Name,player3Name, player4Name, mode,matchId } = state;

  const { ws, isReady } = useWebSocket(`ws://${import.meta.env.VITE_DOMAIN}:3000/ws`);



  const endGame = (matchId) => {
    if (ws && isReady && ws.readyState == WebSocket.OPEN)
      ws.send(JSON.stringify({
        token:localStorage.getItem("token"),
        type: "FINISHED",
        mode: mode,
        matchId
      }));
  };

  useEffect(() => {
    if (!ws) return;
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.score1  == 5 ||  data.score2  == 5) {
        const winner = data.score1  > data.score2 ? (data.player1Name + " " + (data.player3Name|| "" )) : (data.player2Name + " " + data.player4Name || "") ;
        endGame(data.matchId);
        toast.success(`${winner} wins the match!`);
        navigate("/")
      }
    };
    ws.addEventListener("message", handleMessage);
    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, [ws]);
  return (
    <div className="ai-game-page">
      <div className="ai-game-container">
        <div className="ai-game-header">
          <div className="ai-game-title-container">
            <h1 className="ai-game-title glow-text">
              <span>PLAYER VS Player</span>
            </h1>
            <p className="ai-game-subtitle">
            Challenge Other Players.
            </p>
          </div>
        </div>
  
        <div className="ai-game-canvas-container">
        {isReady && (
            <PongCanvasOnline
              player1Name={player1Name}
              player2Name={player2Name}
              player3Name={player3Name}
              player4Name={player4Name}
              ws={ws}
              mode={mode}
              matchId={matchId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GameOnline;