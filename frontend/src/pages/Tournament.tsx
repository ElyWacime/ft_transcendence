import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerForm } from "@/components/PlayerForm";
import { TournamentBracket } from "@/components/TournamentBracket";
import { Chat } from "@/components/Chat";
import { Trophy, Play, Users } from "lucide-react";
import { Tournament as TournamentType, Match, api } from "@/lib/api";
import { toast } from "sonner";
// import { useAuth } from "@/context/AuthContext";

const Tournament = () => {
  const navigate = useNavigate();
  // const { isLoggedIn } = useAuth();
 
  const [tournament, setTournament] = useState<TournamentType | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<{ id: string; alias: string } | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate("/login");
  //     return;
  //   }
  // }, [isLoggedIn, navigate]);
  //
  useEffect(() => {
    // Load existing tournament if any
    const loadTournament = async () => {
      try {
        const existingTournament = await api.getTournament();
        if (existingTournament) {
          setTournament(existingTournament);
        } else {
          // Create new tournament
          const newTournament = await api.createTournament("Pong Championship");
          setTournament(newTournament);
        }
      } catch (error) {
        console.error("Failed to load tournament:", error);
        toast.error("Failed to load tournament");
      }
    };

    loadTournament();
  }, []);

  const handleAddPlayer = async (alias: string) => {
    if (!tournament) return;

    try {
      const player = await api.addPlayer(alias);
      const updatedTournament = await api.getTournament();
      if (updatedTournament) {
        setTournament(updatedTournament);
        toast.success(`${alias} joined the tournament!`);
        
        // Send system message
        await api.sendSystemMessage(`${alias} joined the tournament`);
        
        // Set as current player if first one added
        if (!currentPlayer) {
          setCurrentPlayer({ id: player.id, alias: player.alias });
        }
      }
    } catch (error) {
      console.error("Failed to add player:", error);
      toast.error("Failed to add player");
    }
  };

  const handleStartTournament = async () => {
    if (!tournament || tournament.players.length < 2) {
      toast.error("Need at least 2 players to start tournament");
      return;
    }

    try {
      const startedTournament = await api.startTournament();
      setTournament(startedTournament);
      toast.success("Tournament started! Let the games begin!");
      
      // Send system message
      await api.sendSystemMessage("Tournament has started! Good luck to all players!");
    } catch (error) {
      console.error("Failed to start tournament:", error);
      toast.error("Failed to start tournament");
    }
  };

  const handleStartMatch = async (match: Match) => {
    try {
      // Send system message
      await api.sendSystemMessage(`Match starting: ${match.player1.alias} vs ${match.player2.alias}`);
      
      // Navigate to game with match data
      navigate("/game", { 
        state: { 
          match,
          player1: match.player1,
          player2: match.player2
        }
      });
    } catch (error) {
      console.error("Failed to start match:", error);
      toast.error("Failed to start match");
    }
  };

  if (!tournament) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tournament...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-8">
      <div className="container mx-auto px-4 space-y-8">
        {/* Tournament Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-game font-bold glow-text">
            <Trophy className="inline w-12 h-12 mr-4 text-primary" />
            TOURNAMENT
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Register players and set up the ultimate Pong championship bracket
          </p>
        </div>

        {tournament.status === 'setup' ? (
          /* Tournament Setup Phase */
          <div className="max-w-4xl mx-auto space-y-8">
            <PlayerForm
              onAddPlayer={handleAddPlayer}
              players={tournament.players}
              minPlayers={2}
              maxPlayers={8}
            />

            {tournament.players.length >= 2 && (
              <Card className="bg-gradient-secondary border-border">
                <CardHeader>
                  <CardTitle className="text-center font-game">Ready to Start?</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    {tournament.players.length} players registered. The tournament will generate a bracket automatically.
                  </p>
                  <Button
                    onClick={handleStartTournament}
                    size="lg"
                    className="bg-gradient-primary hover:scale-105 transition-transform animate-pulse-glow font-game"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    START TOURNAMENT
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Tournament Active Phase */
          <div className="max-w-6xl mx-auto">
            <TournamentBracket
              tournament={tournament}
              onStartMatch={handleStartMatch}
            />
          </div>
        )}

        {/* Chat Component */}
        <Chat
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
          currentPlayerId={currentPlayer?.id}
          currentPlayerAlias={currentPlayer?.alias}
        />
      </div>
    </div>
  );
};

export default Tournament;
