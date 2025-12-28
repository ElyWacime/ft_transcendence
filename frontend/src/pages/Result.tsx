import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Users, ArrowRight } from "lucide-react";
import { Match, Tournament, Player, api } from "@/lib/api";
import { toast } from "sonner";
import "@/css/result.css";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  
  const match = location.state?.match as Match | undefined;
  const winner = location.state?.winner as Player | undefined;
  const finalScore = location.state?.finalScore as { player1: number; player2: number } | undefined;

  useEffect(() => {
    const loadTournament = async () => {
      try {
        const updatedTournament = await api.getTournament();
        setTournament(updatedTournament);
      } catch (error) {
        console.error("Failed to load tournament:", error);
      }
    };

    loadTournament();
  }, []);

  useEffect(() => {
    if (!match || !winner || !finalScore) {
      toast.error("No match result data found");
      navigate("/tournament");
    }
  }, [match, winner, finalScore, navigate]);

  if (!match || !winner || !finalScore) {
    return null;
  }

  const nextMatch = tournament?.matches.find(m => m.status === 'pending');
  const isTournamentComplete = tournament?.status === 'completed';

  return (
    <div className="result-page">
      <div className="result-container">
        {/* Result Header */}
        <div className="result-header">
          <h1 className="result-title glow-text animate-float">
            <Trophy className="result-title-icon" />
            MATCH RESULT
          </h1>
        </div>

        <div className="result-content">
          {/* Winner Announcement */}
          <Card className="bg-gradient-primary border-border shadow-glow">
            <CardHeader>
              <CardTitle className="winner-card-header">
                <Medal className="winner-card-icon" />
                VICTORY!
              </CardTitle>
            </CardHeader>
            <CardContent className="winner-card-content">
              <div className="winner-name">{winner.alias}</div>
              <div className="winner-score">
                Final Score: {finalScore.player1} - {finalScore.player2}
              </div>
              <div className="winner-match-info">
                Round {match.round} • Match {match.id.split('-')[1]}
              </div>
            </CardContent>
          </Card>

          {/* Match Details */}
          <div className="match-details-grid">
            <Card className="bg-gradient-secondary border-border">
              <CardHeader>
                <CardTitle className="player-card-title">{match.player1.alias}</CardTitle>
              </CardHeader>
              <CardContent className="player-card-content">
                <div className="player-stat-row">
                  <span>Final Score:</span>
                  <span className="player-stat-value">{finalScore.player1}</span>
                </div>
                <div className="player-stat-row">
                  <span>Tournament Wins:</span>
                  <span className="player-stat-label">{match.player1.wins}</span>
                </div>
                <div className="player-stat-row">
                  <span>Total Points:</span>
                  <span className="player-stat-label">{match.player1.score}</span>
                </div>
                {winner.id === match.player1.id && (
                  <div className="player-winner-badge">
                    <Trophy className="player-winner-icon" />
                    <div className="player-winner-text">Winner!</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-secondary border-border">
              <CardHeader>
                <CardTitle className="player-card-title">{match.player2.alias}</CardTitle>
              </CardHeader>
              <CardContent className="player-card-content">
                <div className="player-stat-row">
                  <span>Final Score:</span>
                  <span className="player-stat-value">{finalScore.player2}</span>
                </div>
                <div className="player-stat-row">
                  <span>Tournament Wins:</span>
                  <span className="player-stat-label">{match.player2.wins}</span>
                </div>
                <div className="player-stat-row">
                  <span>Total Points:</span>
                  <span className="player-stat-label">{match.player2.score}</span>
                </div>
                {winner.id === match.player2.id && (
                  <div className="player-winner-badge">
                    <Trophy className="player-winner-icon" />
                    <div className="player-winner-text">Winner!</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tournament Status */}
          {tournament && (
            <Card className="bg-gradient-secondary border-border">
              <CardHeader>
                <CardTitle className="tournament-status-header">
                  <Users className="tournament-status-icon" />
                  <span>Tournament Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="tournament-status-content">
                {isTournamentComplete && tournament.winner ? (
                  <div className="tournament-complete">
                    <div className="tournament-champion-title">
                      🏆 TOURNAMENT CHAMPION 🏆
                    </div>
                    <div className="tournament-champion-name">{tournament.winner.alias}</div>
                    <div className="tournament-champion-message">
                      Congratulations on winning the entire tournament!
                    </div>
                  </div>
                ) : (
                  <div className="tournament-ongoing">
                    <div className="tournament-ongoing-title">Tournament Continues</div>
                    <div className="tournament-match-count">
                      {tournament.matches.filter(m => m.status === 'completed').length} of {tournament.matches.length} matches completed
                    </div>
                    {nextMatch && (
                      <div className="tournament-next-match">
                        Next: {nextMatch.player1.alias} vs {nextMatch.player2.alias}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="result-actions">
            <Button
              onClick={() => navigate("/tournament")}
              size="lg"
              className="bg-gradient-primary result-action-primary"
            >
              <Trophy className="action-icon-left" />
              Back to Tournament
            </Button>
            
            {nextMatch && !isTournamentComplete && (
              <Button
                onClick={() => navigate("/game", {
                  state: {
                    match: nextMatch,
                    player1: nextMatch.player1,
                    player2: nextMatch.player2
                  }
                })}
                size="lg"
                variant="outline"
              >
                Next Match
                <ArrowRight className="action-icon-right" />
              </Button>
            )}
            
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              size="lg"
            >
              Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
