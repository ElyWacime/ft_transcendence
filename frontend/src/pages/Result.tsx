import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Users, ArrowRight } from "lucide-react";
import { Match, Tournament, Player, api } from "@/lib/api";
import { toast } from "sonner";

const Result = () => {
  // const location = useLocation();
  // const navigate = useNavigate();
  // const [tournament, setTournament] = useState<Tournament | null>(null);
  
  // // Get result data from navigation state
  // const match = location.state?.match as Match | undefined;
  // const winner = location.state?.winner as Player | undefined;
  // const finalScore = location.state?.finalScore as { player1: number; player2: number } | undefined;

  // useEffect(() => {
  //   // Load updated tournament data
  //   const loadTournament = async () => {
  //     try {
  //       const updatedTournament = await api.getTournament();
  //       setTournament(updatedTournament);
  //     } catch (error) {
  //       console.error("Failed to load tournament:", error);
  //     }
  //   };

  //   loadTournament();
  // }, []);

  // useEffect(() => {
  //   // Redirect if no match data
  //   if (!match || !winner || !finalScore) {
  //     toast.error("No match result data found");
  //     navigate("/tournament");
  //   }
  // }, [match, winner, finalScore, navigate]);

  // if (!match || !winner || !finalScore) {
  //   return null;
  // }

  // const nextMatch = tournament?.matches.find(m => m.status === 'pending');
  // const isTournamentComplete = tournament?.status === 'completed';

  // return (
  //   <div className="min-h-screen pt-16 pb-8">
  //     <div className="container mx-auto px-4 space-y-8">
  //       {/* Result Header */}
  //       <div className="text-center space-y-4">
  //         <h1 className="text-4xl md:text-6xl font-game font-bold glow-text animate-float">
  //           <Trophy className="inline w-12 h-12 mr-4 text-primary" />
  //           MATCH RESULT
  //         </h1>
  //       </div>

  //       <div className="max-w-4xl mx-auto space-y-8">
  //         {/* Winner Announcement */}
  //         <Card className="bg-gradient-primary border-border shadow-glow">
  //           <CardHeader>
  //             <CardTitle className="text-center text-primary-foreground">
  //               <Medal className="inline w-8 h-8 mr-2" />
  //               VICTORY!
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent className="text-center text-primary-foreground space-y-4">
  //             <div className="text-4xl font-game font-bold">{winner.alias}</div>
  //             <div className="text-lg">
  //               Final Score: {finalScore.player1} - {finalScore.player2}
  //             </div>
  //             <div className="text-sm opacity-80">
  //               Round {match.round} • Match {match.id.split('-')[1]}
  //             </div>
  //           </CardContent>
  //         </Card>

  //         {/* Match Details */}
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //           <Card className="bg-gradient-secondary border-border">
  //             <CardHeader>
  //               <CardTitle className="text-lg">{match.player1.alias}</CardTitle>
  //             </CardHeader>
  //             <CardContent className="space-y-2">
  //               <div className="flex justify-between">
  //                 <span>Final Score:</span>
  //                 <span className="font-bold text-2xl">{finalScore.player1}</span>
  //               </div>
  //               <div className="flex justify-between">
  //                 <span>Tournament Wins:</span>
  //                 <span className="font-semibold">{match.player1.wins}</span>
  //               </div>
  //               <div className="flex justify-between">
  //                 <span>Total Points:</span>
  //                 <span className="font-semibold">{match.player1.score}</span>
  //               </div>
  //               {winner.id === match.player1.id && (
  //                 <div className="text-center pt-2">
  //                   <Trophy className="w-6 h-6 text-accent mx-auto" />
  //                   <div className="text-accent font-semibold">Winner!</div>
  //                 </div>
  //               )}
  //             </CardContent>
  //           </Card>

  //           <Card className="bg-gradient-secondary border-border">
  //             <CardHeader>
  //               <CardTitle className="text-lg">{match.player2.alias}</CardTitle>
  //             </CardHeader>
  //             <CardContent className="space-y-2">
  //               <div className="flex justify-between">
  //                 <span>Final Score:</span>
  //                 <span className="font-bold text-2xl">{finalScore.player2}</span>
  //               </div>
  //               <div className="flex justify-between">
  //                 <span>Tournament Wins:</span>
  //                 <span className="font-semibold">{match.player2.wins}</span>
  //               </div>
  //               <div className="flex justify-between">
  //                 <span>Total Points:</span>
  //                 <span className="font-semibold">{match.player2.score}</span>
  //               </div>
  //               {winner.id === match.player2.id && (
  //                 <div className="text-center pt-2">
  //                   <Trophy className="w-6 h-6 text-accent mx-auto" />
  //                   <div className="text-accent font-semibold">Winner!</div>
  //                 </div>
  //               )}
  //             </CardContent>
  //           </Card>
  //         </div>

  //         {/* Tournament Status */}
  //         {tournament && (
  //           <Card className="bg-gradient-secondary border-border">
  //             <CardHeader>
  //               <CardTitle className="flex items-center space-x-2">
  //                 <Users className="w-5 h-5 text-primary" />
  //                 <span>Tournament Status</span>
  //               </CardTitle>
  //             </CardHeader>
  //             <CardContent className="space-y-4">
  //               {isTournamentComplete && tournament.winner ? (
  //                 <div className="text-center space-y-4">
  //                   <div className="text-2xl font-game font-bold text-accent">
  //                     🏆 TOURNAMENT CHAMPION 🏆
  //                   </div>
  //                   <div className="text-xl font-semibold">{tournament.winner.alias}</div>
  //                   <div className="text-muted-foreground">
  //                     Congratulations on winning the entire tournament!
  //                   </div>
  //                 </div>
  //               ) : (
  //                 <div className="text-center space-y-2">
  //                   <div className="text-lg font-semibold">Tournament Continues</div>
  //                   <div className="text-muted-foreground">
  //                     {tournament.matches.filter(m => m.status === 'completed').length} of {tournament.matches.length} matches completed
  //                   </div>
  //                   {nextMatch && (
  //                     <div className="text-sm">
  //                       Next: {nextMatch.player1.alias} vs {nextMatch.player2.alias}
  //                     </div>
  //                   )}
  //                 </div>
  //               )}
  //             </CardContent>
  //           </Card>
  //         )}

  //         {/* Action Buttons */}
  //         <div className="flex flex-col sm:flex-row gap-4 justify-center">
  //           <Button
  //             onClick={() => navigate("/tournament")}
  //             size="lg"
  //             className="bg-gradient-primary hover:scale-105 transition-transform"
  //           >
  //             <Trophy className="w-5 h-5 mr-2" />
  //             Back to Tournament
  //           </Button>
            
  //           {nextMatch && !isTournamentComplete && (
  //             <Button
  //               onClick={() => navigate("/game", {
  //                 state: {
  //                   match: nextMatch,
  //                   player1: nextMatch.player1,
  //                   player2: nextMatch.player2
  //                 }
  //               })}
  //               size="lg"
  //               variant="outline"
  //             >
  //               Next Match
  //               <ArrowRight className="w-5 h-5 ml-2" />
  //             </Button>
  //           )}
            
  //           <Button
  //             onClick={() => navigate("/")}
  //             variant="outline"
  //             size="lg"
  //           >
  //             Home
  //           </Button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (<></>);
};

export default Result;
