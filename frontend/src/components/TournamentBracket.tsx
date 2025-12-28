import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Play, CheckCircle, Clock } from "lucide-react";
import { Match, Tournament } from "@/lib/api";
import "../css/tournament-bracket.css";

interface TournamentBracketProps {
  tournament: Tournament;
  onStartMatch: (match: Match) => void;
}

export const TournamentBracket = ({ tournament, onStartMatch }: TournamentBracketProps) => {
  const getMatchStatusIcon = (status: Match['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="icon-sm" />;
      case 'playing':
        return <Play className="icon-sm text-primary" />;
      case 'completed':
        return <CheckCircle className="icon-sm text-accent" />;
    }
  };

  const getMatchStatusBadge = (status: Match['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'playing':
        return <Badge className="bg-primary-themed">Playing</Badge>;
      case 'completed':
        return <Badge className="bg-accent-themed">Completed</Badge>;
    }
  };

  const groupMatchesByRound = () => {
    const rounds = new Map<number, Match[]>();
    tournament.matches.forEach(match => {
      const roundMatches = rounds.get(match.round) || [];
      roundMatches.push(match);
      rounds.set(match.round, roundMatches);
    });
    return Array.from(rounds.entries()).sort((a, b) => a[0] - b[0]);
  };

  const rounds = groupMatchesByRound();

  return (
    <div className="space-y-6">
      {/* Tournament Header */}
      <Card className="bg-gradient-secondary border-default">
        <CardHeader>
          <CardTitle className="space-x-2 font-game">
            <Trophy className="icon-md text-primary" />
            <span>{tournament.name}</span>
            {tournament.status === 'completed' && tournament.winner && (
              <Badge className="bg-accent-themed">
                Winner: {tournament.winner.alias}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md-grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{tournament.players.length}</p>
              <p className="text-muted">Players</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">
                {tournament.matches.filter(m => m.status === 'completed').length}
              </p>
              <p className="text-muted">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {tournament.matches.filter(m => m.status === 'pending').length}
              </p>
              <p className="text-muted">Remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tournament Bracket */}
      <div className="space-y-8">
        {rounds.map(([roundNumber, matches]) => (
          <div key={roundNumber} className="space-y-4">
            <h3 className="text-xl font-game font-bold text-center glow-text">
              Round {roundNumber}
            </h3>
            <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3 gap-4">
              {matches.map((match) => (
                <Card
                  key={match.id}
                  className={`bg-gradient-secondary border-default transition-all duration-300 ${
                    match.status === 'playing' ? 'border-primary glow-blue' : ''
                  }`}
                >
                  <CardHeader className="padding-bottom-3">
                    <div className="flex items-center justify-between">
                      <div className="space-x-2">
                        {getMatchStatusIcon(match.status)}
                        <span className="font-semibold">Match {match.id.split('-')[1]}</span>
                      </div>
                      {getMatchStatusBadge(match.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Players */}
                    <div className="space-y-2">
                      <div className={`flex items-center justify-between padding-small rounded ${
                        match.winner?.id === match.player1.id ? 'bg-accent-subtle' : 'bg-card'
                      }`}>
                        <span className="font-medium">{match.player1.alias}</span>
                        <span className="font-bold text-lg">{match.score1}</span>
                      </div>
                      <div className="text-center text-xs text-muted">VS</div>
                      <div className={`flex items-center justify-between padding-small rounded ${
                        match.winner?.id === match.player2.id ? 'bg-accent-subtle' : 'bg-card'
                      }`}>
                        <span className="font-medium">{match.player2.alias}</span>
                        <span className="font-bold text-lg">{match.score2}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    {match.status === 'pending' && (
                      <Button
                        onClick={() => onStartMatch(match)}
                        className="full-width bg-gradient-primary scale-hover transition-transform"
                      >
                        <Play className="icon-sm" style={{marginRight: '0.5rem'}} />
                        Start Match
                      </Button>
                    )}

                    {match.status === 'completed' && match.winner && (
                      <div className="text-center">
                        <Badge className="bg-accent-themed">
                          <Trophy className="icon-sm" style={{marginRight: '0.25rem'}} />
                          {match.winner.alias} Wins!
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Player Leaderboard */}
      <Card className="bg-gradient-secondary border-default">
        <CardHeader>
          <CardTitle className="font-game">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tournament.players
              .sort((a, b) => b.wins - a.wins || b.score - a.score)
              .map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between padding-medium bg-card rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`width-8 height-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-accent-themed' : 'bg-primary-themed'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{player.alias}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted">
                      {player.wins}W - {player.losses}L
                    </div>
                    <div className="font-bold">{player.score} pts</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
