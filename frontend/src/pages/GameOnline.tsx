import { useLocation, useNavigate } from "react-router-dom";
import { PongCanvasOnline } from "@/components/PongCanvasOnline";
import { useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { toast } from "sonner";

interface GameOnlineProps {
  player1Name: string;
  player2Name: string;
  player3Name: string;
  player4Name: string;
  mode: number;
}

const GameOnline = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const { player1Name, player2Name,player3Name, player4Name, mode } = location.state as GameOnlineProps;

  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
  const wsHost = import.meta.env.VITE_DOMAIN || window.location.hostname;
  const { ws, isReady } = useWebSocket(`${wsProtocol}://${wsHost}/ws`);



  const endGame = () => {
    if (ws && isReady && ws.readyState == WebSocket.OPEN)
      ws.send(JSON.stringify({
        token:localStorage.getItem("token"),
        type: "FINISHED",
        email: email,
        tournement: false,
        keys: { ArrowUp: false, ArrowDown: false },
        mode: mode,
        id: localStorage.getItem("email")
      }));
  };

  useEffect(() => {
    if (!ws) return;
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
    
      if (data.gameStatus == "FINISHED") {
        const winner = data.score1  > data.score2 ? data.player1Name : data.player2Name;
        toast.success(`${winner} wins the match!`);
        endGame();
        navigate("/");
      }
    };
    ws.addEventListener("message", handleMessage);
    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, [ws]);

  return (
    <div className="game-page">
      <div className="game-container">
        <div className="game-header">
          <div style={{ paddingTop: "3rem" }} className="ai-game-title-container">
            <h1 className="ai-game-title glow-text">
              <span>PLAYER VS Player</span>
            </h1>
            <p className="ai-game-subtitle">
              Challenge Other Players.
            </p>
          </div>
          <div className="header-spacer"></div>
        </div>
        <div className="game-canvas-container">
        {isReady && (
            <PongCanvasOnline
              player1Name={player1Name}
              player2Name={player2Name}
              player3Name={player3Name}
              player4Name={player4Name}
              ws={ws}
              mode={mode}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default GameOnline;