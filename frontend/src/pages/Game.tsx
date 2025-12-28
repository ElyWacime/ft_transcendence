import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PongCanvas } from "@/components/PongCanvas";
import { ArrowLeft, Trophy,Bot } from "lucide-react";
import { Match, api } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const match = location.state?.match as Match | undefined;
  const player1 = location.state?.player1 || { alias: "Player 1" };
  const player2 = location.state?.player2 || { alias: "Player 2" };

  const handleGameEnd = async (player1Score: number, player2Score: number) => {
    try {
      if (match) {
        await api.updateMatchResult(match.id, player1Score, player2Score);

        const winner = player1Score > player2Score ? player1.alias : player2.alias;

        await api.sendSystemMessage(`Match completed! ${winner} defeated ${player1Score > player2Score ? player2.alias : player1.alias} (${player1Score}-${player2Score})`);

        toast.success(`${winner} wins the match!`);

        setTimeout(() => {
          navigate("/result", {
            state: {
              match,
              winner: player1Score > player2Score ? player1 : player2,
              finalScore: { player1: player1Score, player2: player2Score }
            }
          });
        }, 2000);
      } else {
        const winner = player1Score > player2Score ? player1.alias : player2.alias;
        toast.success(`${winner} wins!`);
      }
    } catch (error) {
      console.error("Failed to update match result:", error);
      toast.error("Failed to save match result");
    }
  };

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
              <span>PLAYER VS Freind</span>
            </h1>
            <p className="ai-game-subtitle">
              Challenge your Freind.
            </p>
          </div>
          <div className="header-spacer"></div>
        </div>
        <div className="game-canvas-container">
          <PongCanvas
            player1Name={player1.alias}
            player2Name={player2.alias}
            onGameEnd={handleGameEnd}
            maxScore={5}
          />
        </div>

      </div>
    </div>
  );
};

export default Game;