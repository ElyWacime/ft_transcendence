interface Match {
  id_Match: number;
  P1_Id: string;
  P2_Id: string;
  player1Name: string;
  player2Name: string;
  gameStatus: string;
  Winner_Id?: string;
}

interface Props {
  matches: Match[];
}

export const TournamentBracket = ({ matches }: Props) => {
  if (!matches.length) {
    return (
      <p className="text-center text-muted-foreground">
        Waiting for tournament matches...
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {matches.map(m => (
        <div key={m.id_Match} className="border rounded p-4">
          <div className="flex justify-between font-semibold">
            <span>{m.player1Name}</span>
            <span>vs</span>
            <span>{m.player2Name}</span>
          </div>

          <div className="text-center text-sm mt-2">
            Status: {m.gameStatus}
          </div>

          {m.gameStatus === "FINISHED" && (
            <div className="text-center font-bold mt-2">
              Winner:{" "}
              {m.Winner_Id === m.P1_Id ? m.player1Name : m.player2Name}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};









// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Trophy, Play, CheckCircle, Clock } from "lucide-react";
// import { Match, Tournament } from "@/lib/api";

// interface TournamentBracketProps {
//   tournament: Tournament;
//   onStartMatch: (match: Match) => void;
// }

// export const TournamentBracket = ({ tournament, onStartMatch }: TournamentBracketProps) => {
//   const getMatchStatusIcon = (status: Match['status']) => {
//     switch (status) {
//       case 'pending':
//         return <Clock className="w-4 h-4" />;
//       case 'playing':
//         return <Play className="w-4 h-4 text-primary" />;
//       case 'completed':
//         return <CheckCircle className="w-4 h-4 text-accent" />;
//     }
//   };

//   const getMatchStatusBadge = (status: Match['status']) => {
//     switch (status) {
//       case 'pending':
//         return <Badge variant="secondary">Pending</Badge>;
//       case 'playing':
//         return <Badge className="bg-primary">Playing</Badge>;
//       case 'completed':
//         return <Badge className="bg-accent">Completed</Badge>;
//     }
//   };

//   const groupMatchesByRound = () => {
//     const rounds = new Map<number, Match[]>();
//     tournament.matches.forEach(match => {
//       const roundMatches = rounds.get(match.round) || [];
//       roundMatches.push(match);
//       rounds.set(match.round, roundMatches);
//     });
//     return Array.from(rounds.entries()).sort((a, b) => a[0] - b[0]);
//   };

//   const rounds = groupMatchesByRound();

//   return (
//     <div className="space-y-6">
//       {/* Tournament Header */}
//       <Card className="bg-gradient-secondary border-border">
//         <CardHeader>
//           <CardTitle className="flex items-center space-x-2 font-game">
//             <Trophy className="w-6 h-6 text-primary" />
//             <span>{tournament.name}</span>
//             {tournament.status === 'completed' && tournament.winner && (
//               <Badge className="bg-accent text-accent-foreground">
//                 Winner: {tournament.winner.alias}
//               </Badge>
//             )}
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
//             <div>
//               <p className="text-2xl font-bold text-primary">{tournament.players.length}</p>
//               <p className="text-muted-foreground">Players</p>
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-accent">
//                 {tournament.matches.filter(m => m.status === 'completed').length}
//               </p>
//               <p className="text-muted-foreground">Completed</p>
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-primary">
//                 {tournament.matches.filter(m => m.status === 'pending').length}
//               </p>
//               <p className="text-muted-foreground">Remaining</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Tournament Bracket */}
//       <div className="space-y-8">
//         {rounds.map(([roundNumber, matches]) => (
//           <div key={roundNumber} className="space-y-4">
//             <h3 className="text-xl font-game font-bold text-center glow-text">
//               Round {roundNumber}
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {matches.map((match) => (
//                 <Card
//                   key={match.id}
//                   className={`bg-gradient-secondary border-border transition-all duration-300 ${
//                     match.status === 'playing' ? 'border-primary glow-blue' : ''
//                   }`}
//                 >
//                   <CardHeader className="pb-3">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-2">
//                         {getMatchStatusIcon(match.status)}
//                         <span className="font-semibold">Match {match.id.split('-')[1]}</span>
//                       </div>
//                       {getMatchStatusBadge(match.status)}
//                     </div>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {/* Players */}
//                     <div className="space-y-2">
//                       <div className={`flex items-center justify-between p-2 rounded ${
//                         match.winner?.id === match.player1.id ? 'bg-accent/20' : 'bg-card'
//                       }`}>
//                         <span className="font-medium">{match.player1.alias}</span>
//                         <span className="font-bold text-lg">{match.score1}</span>
//                       </div>
//                       <div className="text-center text-xs text-muted-foreground">VS</div>
//                       <div className={`flex items-center justify-between p-2 rounded ${
//                         match.winner?.id === match.player2.id ? 'bg-accent/20' : 'bg-card'
//                       }`}>
//                         <span className="font-medium">{match.player2.alias}</span>
//                         <span className="font-bold text-lg">{match.score2}</span>
//                       </div>
//                     </div>

//                     {/* Action Button */}
//                     {match.status === 'pending' && (
//                       <Button
//                         onClick={() => onStartMatch(match)}
//                         className="w-full bg-gradient-primary hover:scale-105 transition-transform"
//                       >
//                         <Play className="w-4 h-4 mr-2" />
//                         Start Match
//                       </Button>
//                     )}

//                     {match.status === 'completed' && match.winner && (
//                       <div className="text-center">
//                         <Badge className="bg-accent">
//                           <Trophy className="w-3 h-3 mr-1" />
//                           {match.winner.alias} Wins!
//                         </Badge>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Player Leaderboard */}
//       <Card className="bg-gradient-secondary border-border">
//         <CardHeader>
//           <CardTitle className="font-game">Leaderboard</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-2">
//             {tournament.players
//               .sort((a, b) => b.wins - a.wins || b.score - a.score)
//               .map((player, index) => (
//                 <div
//                   key={player.id}
//                   className="flex items-center justify-between p-3 bg-card rounded-lg"
//                 >
//                   <div className="flex items-center space-x-3">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
//                       index === 0 ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'
//                     }`}>
//                       {index + 1}
//                     </div>
//                     <span className="font-medium">{player.alias}</span>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-sm text-muted-foreground">
//                       {player.wins}W - {player.losses}L
//                     </div>
//                     <div className="font-bold">{player.score} pts</div>
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };
