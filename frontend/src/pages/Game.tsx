import { PongCanvas } from "@/components/PongCanvas";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";


const Game = () => {
  const { user } = useAuth();

  const player1 = user?.name || user?.email || "You";
  const player2 = "Player 2" ;

  const handleGameEnd = async (player1Score: number, player2Score: number) => {
    try {
        const winner = player1Score > player2Score ? player1 : player2;
        toast.success(`${winner} wins the match!`);
    } catch (error) {
      console.error("Failed to update match result:", error);
      toast.error("Failed to save match result");
    }
  };
  return (
    <div className="ai-game-page">
      <div className="ai-game-container">
        <div className="ai-game-header">
          <div className="ai-game-title-container">
            <h1 className="ai-game-title glow-text">
            <span>PLAYER VS Freind</span>
            </h1>
            <p className="ai-game-subtitle">
            Challenge your Freind.
            </p>
          </div>
        </div>
  
        <div className="ai-game-canvas-container">
        <PongCanvas
            player1Name={player1}
            player2Name={player2}
            onGameEnd={handleGameEnd}
            maxScore={5}
          />
        </div>
      </div>
    </div>
  );
};

export default Game;