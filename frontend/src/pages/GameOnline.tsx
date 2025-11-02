import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PongCanvasOnline } from '@/components/PongCanvasOnline';
import { Chat } from '@/components/Chat';
import { ArrowLeft, Trophy } from 'lucide-react';
import { Match } from '@/lib/api';
import { toast } from 'sonner';
import { useState } from 'react';

const GameOnline: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const match = location.state?.match as Match | undefined;
  const player1 = location.state?.player1 || { alias: 'Player 1' };
  const player2 = location.state?.player2 || { alias: 'Player 2' };

  const handleGameEnd = async (player1Score: number, player2Score: number) => {
    try {
      // keep existing behavior (no api calls here to avoid coupling)
      const winner = player1Score > player2Score ? player1.alias : player2.alias;
      toast.success(`${winner} wins!`);
      setTimeout(() => {
        navigate('/result', { state: { match, winner: player1Score > player2Score ? player1 : player2, finalScore: { player1: player1Score, player2: player2Score } } });
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save result');
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-8">
      <div className="container mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <Button onClick={() => navigate(-1)} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>

          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-game font-bold glow-text flex items-center justify-center space-x-2">
              {match && <Trophy className="w-8 h-8 text-primary" />}
              <span>{match ? 'TOURNAMENT MATCH' : 'QUICK GAME (ONLINE)'}</span>
            </h1>
          </div>

          <div className="w-20" />
        </div>

        <div className="max-w-6xl mx-auto">
          <PongCanvasOnline
            player1Name={player1.alias}
            player2Name={player2.alias}
            onGameEnd={handleGameEnd}
            maxScore={5}
            serverUrl={process.env.REACT_APP_GAME_SERVER ?? 'http://localhost:3001'}
            roomId={match?.id}
          />
        </div>

        <Chat isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
      </div>
    </div>
  );
};

export default GameOnline;