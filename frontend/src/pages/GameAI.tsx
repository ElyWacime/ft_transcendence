import { PongCanvasAI } from "@/components/PongCanvasAI";
import { useAuth } from "@/context/AuthContext";

const GameAI = () => {
  const { user } = useAuth();
  const player1 = user?.name  || "You";
  const player2 = "AI Opponent" ;
  return (
    <div className="ai-game-page">
      <div className="ai-game-container">
        <div className="ai-game-header">
          <div className="ai-game-title-container">
            <h1 className="ai-game-title glow-text">
              <span>PLAYER VS AI</span>
            </h1>
            <p className="ai-game-subtitle">
              Challenge our adaptive AI opponent at different difficulty levels.
            </p>
          </div>
        </div>
  
        <div className="ai-game-canvas-container">
          <PongCanvasAI
            player1Name={player1}
            player2Name={player2}
            enableAI
            maxScore={5}
          />
        </div>
      </div>
    </div>
  );
};

export default GameAI;