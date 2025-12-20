import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PongCanvas } from "@/components/PongCanvas";
import { Chat } from "@/components/Chat";
import { ArrowLeft, Trophy } from "lucide-react";
import { Match, api } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Get match data from navigation state
  const match = location.state?.match as Match | undefined;
  const player1 = location.state?.player1 || { alias: localStorage.getItem("email") };
  const player2 = location.state?.player2 || { alias: "Player 2" };

  const handleGameEnd = async (player1Score: number, player2Score: number) => {
    try {
      if (match) {
        // Update match result in tournament
        await api.updateMatchResult(match.id, player1Score, player2Score);

        const winner = player1Score > player2Score ? player1.alias : player2.alias;

        // Send system message
        await api.sendSystemMessage(`Match completed! ${winner} defeated ${player1Score > player2Score ? player2.alias : player1.alias} (${player1Score}-${player2Score})`);

        toast.success(`${winner} wins the match!`);

        // Navigate to result page
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
        // Quick game - no tournament
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
        {/* Game Header */}
        <div className="game-header">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="back-button"
          >
            <ArrowLeft className="back-icon" />
            <span>Back</span>
          </Button>
  
          <div className="game-title-container">
            <h1 className="game-title glow-text">
              {match && <Trophy className="trophy-icon" />}
              <span>{match ? "TOURNAMENT MATCH" : "QUICK GAME"}</span>
            </h1>
            {match && (
              <p className="match-info">
                Round {match.round} • Match {match.id.split('-')[1]}
              </p>
            )}
          </div>
  
          <div className="header-spacer"></div>
        </div>
  
        {/* Game Canvas */}
        <div className="game-canvas-container">
          <PongCanvas
            player1Name={player1.alias}
            player2Name={player2.alias}
            onGameEnd={handleGameEnd}
            maxScore={5}
          />
        </div>
  
        {/* Match Info */}
        {match && (
          <div className="match-info-card">
            <h3 className="match-info-title">Tournament Match</h3>
            <p className="match-info-description">
              This match is part of the tournament bracket. The winner will advance to the next round.
            </p>
          </div>
        )}
  
        {/* Chat Component */}
        <Chat
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
        />
      </div>
    </div>
  );
};

export default Game;