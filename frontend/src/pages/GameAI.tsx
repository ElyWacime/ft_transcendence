import { PongCanvasAI } from "@/components/PongCanvasAI";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Difficulty } from "@/lib/ai/AIOpponent";

const GameAI = () => {
  const { user } = useAuth();
  const player1 = user?.name || "You";
  const player2 = "AI Opponent";
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(
    Difficulty.HARD
  );

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

          <div className="difficulty-selector">
            <label htmlFor="difficulty-select" className="difficulty-label">
              Select Difficulty:
            </label>
            <select
              id="difficulty-select"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty)}
              className="difficulty-select"
            >
              <option value={Difficulty.EASY}>Easy</option>
              <option value={Difficulty.MEDIUM}>Medium</option>
              <option value={Difficulty.HARD}>Hard</option>
            </select>
          </div>
        </div>

        <div className="ai-game-canvas-container">
          <PongCanvasAI
            player1Name={player1}
            player2Name={player2}
            enableAI
            aiDifficulty={selectedDifficulty}
            maxScore={5}
          />
        </div>
      </div>
    </div>
  );
};

export default GameAI;