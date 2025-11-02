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
  const player1 = location.state?.player1 || { alias: "Player 1" };
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
    <div className="min-h-screen pt-16 pb-8">
      <div className="container mx-auto px-4 space-y-6">
        {/* Game Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-game font-bold glow-text flex items-center justify-center space-x-2">
              {match && <Trophy className="w-8 h-8 text-primary" />}
              <span>{match ? "TOURNAMENT MATCH" : "QUICK GAME"}</span>
            </h1>
            {match && (
              <p className="text-muted-foreground mt-2">
                Round {match.round} • Match {match.id.split('-')[1]}
              </p>
            )}
          </div>
          
          <div className="w-20"> {/* Spacer for balance */}
          </div>
        </div>

        {/* Game Canvas */}
        <div className="max-w-6xl mx-auto">
          <PongCanvas
            player1Name={player1.alias}
            player2Name={player2.alias}
            onGameEnd={handleGameEnd}
            maxScore={5}
          />
        </div>

        {/* Match Info */}
        {match && (
          <div className="max-w-2xl mx-auto text-center bg-gradient-secondary p-4 rounded-lg border border-border">
            <h3 className="font-semibold mb-2">Tournament Match</h3>
            <p className="text-sm text-muted-foreground">
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
