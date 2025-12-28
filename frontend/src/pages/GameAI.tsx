import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PongCanvasAI } from "@/components/PongCanvasAI";
import { Bot } from "lucide-react";

const GameAI = () => {
  return (
    <div className="ai-game-page">
      <div className="ai-game-container">
        <div className="ai-game-header">
          <div className="ai-game-title-container">
            <h1 className="ai-game-title glow-text">
              <Bot className="ai-icon" />
              <span>PLAYER VS AI</span>
            </h1>
            <p className="ai-game-subtitle">
              Challenge our adaptive AI opponent at different difficulty levels.
            </p>
          </div>
        </div>
  
        <div className="ai-game-canvas-container">
          <PongCanvasAI
            player1Name="You"
            player2Name="AI Opponent"
            enableAI
            maxScore={5}
          />
        </div>
      </div>
    </div>
  );
};

export default GameAI;