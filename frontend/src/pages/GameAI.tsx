import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PongCanvasAI } from "@/components/PongCanvasAI";
import { ArrowLeft, Bot, Gauge } from "lucide-react";

const GameAI = () => {
  const navigate = useNavigate();

  const playerAlias = localStorage.getItem("email") || "Player 1";

  return (
    <div className="ai-game-page">
      <div className="ai-game-container">
        <div className="ai-game-header">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="ai-back-button"
          >
            <ArrowLeft className="back-icon" />
            <span>Back</span>
          </Button>
  
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
            player1Name={playerAlias}
            player2Name="AI Opponent"
            enableAI
            maxScore={5}
          />
        </div>
        <div className="ai-mode-info-card">
          <h3 className="ai-mode-info-title">Switching Modes</h3>
          <p className="ai-mode-info-description">
            Use the navigation tab to jump back to the regular two-player match whenever you want.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameAI;