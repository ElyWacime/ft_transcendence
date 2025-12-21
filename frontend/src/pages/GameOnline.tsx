import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PongCanvasOnline } from "@/components/PongCanvasOnline";
import { PongCanvas } from "@/components/PongCanvas";
import { Chat } from "@/components/Chat";
import { ArrowLeft, Trophy } from "lucide-react";
import { Match, api } from "@/lib/api";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const email = localStorage.getItem("email");
  const { player1Name, player2Name,player3Name, player4Name, mode } = location.state as GameOnlineProps;
  const match = location.state?.match as Match | undefined;

  const { ws, send, isReady } = useWebSocket(`ws://${import.meta.env.VITE_DOMAIN}:3000/ws`);

  const endGame = () => {
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
        // ws.close();
        endGame();
        console.log("Match FINISHED try to navigate>>>>>>>");
        navigate("/");
      }
    };
    ws.addEventListener("message", handleMessage);
    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, [ws]);

  // const handleGameEnd = async (player1Score: number, player2Score: number) => {
  //   try {
  //     if (match) {
  //       // Update match result in tournament
  //       await api.updateMatchResult(match.id, player1Score, player2Score);

  //       const winner = player1Score > player2Score ? player1.alias : player2.alias;

  //       // Send system message
  //       await api.sendSystemMessage(`Match completed! ${winner} defeated ${player1Score > player2Score ? player2.alias : player1.alias} (${player1Score}-${player2Score})`);

  //       toast.success(`${winner} wins the match!`);

  //       // Navigate to result page
  //       setTimeout(() => {
  //         navigate("/result", {
  //           state: {
  //             match,
  //             winner: player1Score > player2Score ? player1 : player2,
  //             finalScore: { player1: player1Score, player2: player2Score }
  //           }
  //         });
  //       }, 2000);
  //     } else {
  //       // Quick game - no tournament
  //       const winner = player1Score > player2Score ? player1.alias : player2.alias;
  //       toast.success(`${winner} wins!`);
  //     }
  //   } catch (error) {
  //     console.error("Failed to update match result:", error);
  //     toast.error("Failed to save match result");
  //   }
  // };

  return (
    <div className="game-page">
      <div className="game-container">
        <div className="game-header">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="back-button"
          >
            <ArrowLeft className="back-icon" />
            <span>Back</span>
          </Button>
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