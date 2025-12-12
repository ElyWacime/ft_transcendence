import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PongCanvas } from "@/components/PongCanvas";
import { Chat } from "@/components/Chat";
import { ArrowLeft, Bot, Gauge } from "lucide-react";
import { Difficulty } from "@/lib/ai/AIOpponent";

const difficultyOrder = [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD] as const;

const friendlyDifficulty = (value: Difficulty) => value.charAt(0) + value.slice(1).toLowerCase();

const GameAI = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);

  const handleCycleDifficulty = () => {
    const index = difficultyOrder.indexOf(difficulty);
    const nextDifficulty = difficultyOrder[(index + 1) % difficultyOrder.length];
    setDifficulty(nextDifficulty);
  };

  const playerAlias = localStorage.getItem("email") || "Player 1";

  return (
    <div className="min-h-screen pt-16 pb-8">
      <div className="container mx-auto px-4 space-y-6">
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
              <Bot className="w-8 h-8 text-primary" />
              <span>PLAYER VS AI</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Challenge our adaptive AI opponent at different difficulty levels.
            </p>
          </div>

          <Button onClick={handleCycleDifficulty} className="flex items-center space-x-2">
            <Gauge className="w-4 h-4" />
            <span>Difficulty: {friendlyDifficulty(difficulty)}</span>
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          <PongCanvas
            player1Name={playerAlias}
            player2Name="AI Opponent"
            enableAI
            aiDifficulty={difficulty}
            maxScore={5}
          />
        </div>

        <div className="max-w-2xl mx-auto text-center bg-gradient-secondary p-4 rounded-lg border border-border">
          <h3 className="font-semibold mb-2">Switching Modes</h3>
          <p className="text-sm text-muted-foreground">
            Use the navigation tab to jump back to the regular two-player match whenever you want.
          </p>
        </div>

        <Chat
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
        />
      </div>
    </div>
  );
};

export default GameAI;