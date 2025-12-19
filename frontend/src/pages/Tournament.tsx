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

import { useWebSocket } from "../hooks/useWebSocket";




const Tournament = () => {
  const navigate = useNavigate();
  // const { isLoggedIn } = useAuth();
  const { ws, isReady } = useWebSocket(
  `ws://${import.meta.env.VITE_DOMAIN}:3000/ws`
);

 const [tournamentPhase, setTournamentPhase] = useState<
    "IDLE" | "SETUP" | "ACTIVE"
  >("SETUP");
  const [tournament, setTournament] = useState<TournamentType | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<{ id: string; alias: string } | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [matches, setMatches] = useState<Match[]>([]);



  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);


  // const [invites, setInvites] = useState<any[]>([]);


  const searchUsers = (value: string) => {
        setSearch(value);

        if (!ws) return;
        if (ws.readyState !== WebSocket.OPEN) return;
        if (!isReady) return;
        if (value.length < 2) return;

        ws.send(JSON.stringify({
          type: "SEARCH_USER",
          token: localStorage.getItem("token"),
          query: value
        }));
      };


  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate("/login");
  //     return;
  //   }
  // }, [isLoggedIn, navigate]);
  //


// -----0
  useEffect(() => {
  if (!ws) return;

  const handler = (e: MessageEvent) => {
    const data = JSON.parse(e.data);

    if (data.type === "TOURNAMENT_JOINED") {
      toast.success("Joined tournament");
    }

    if (data.type === "TOURNAMENT_LOCKED") {
      toast.info("Tournament started");
    }


    if (data.type === "TOURNAMENT_WINNER") {
      toast.success("You won the tournament!");
    }


      if (data.type === "TOURNAMENT_JOINED") {
        setTournamentPhase("SETUP");
      }

      if (data.type === "TOURNAMENT_LOCKED") {
        setTournamentPhase("ACTIVE");
      }


                    if (data.type === "SEARCH_RESULT") {
                setResults(data.users);
              }

              if (data.type === "TOURNAMENT_INVITE") {
                setInvites(prev => [...prev, data]);
              }
              
    if (data.type === "TOURNAMENT_INVITE") {
        setInvites(prev => [...prev, data]);
        toast.info(`${data.from.name} invited you to a tournament`);
      }



    // GameState object → match created
    if (data.gameStatus === "PENDING" && data.T_Id) {
      navigate("/game", {
        state: {
          match: data,
          player1Name: data.player1Name,
          player2Name: data.player2Name,
          mode: 2
        }
      });
    }


     // 🟦 Tournament match updates
    if (data.T_Id && data.id_Match) {
      setMatches(prev => {
        const copy = [...prev];
        const index = copy.findIndex(m => m.id === data.id_Match);

        if (index !== -1) copy[index] = data;
        else copy.push(data);

        return copy;
      });
    }




  };








  ws.addEventListener("message", handler);
  return () => ws.removeEventListener("message", handler);
}, [ws]);
// ------1
  // useEffect(() => {
  //   // Load existing tournament if any
  //   const loadTournament = async () => {
  //     try {
  //       const existingTournament = await api.getTournament();
  //       if (existingTournament) {
  //         setTournament(existingTournament);
  //       } else {
  //         // Create new tournament
  //         const newTournament = await api.createTournament("Pong Championship");
  //         setTournament(newTournament);
  //       }
  //     } catch (error) {
  //       console.error("Failed to load tournament:", error);
  //       toast.error("Failed to load tournament");
  //     }
  //   };

  //   loadTournament();
  // }, []);

    // ----0
  const handleJoinTournament = () => {
  if (!ws) return;
  if (ws.readyState !== WebSocket.OPEN) return;
  if (!isReady) return;

  ws.send(JSON.stringify({
    type: "REGISTER",
    token: localStorage.getItem("token"),
    tournament: true,
    mode: 2
  }));
};

  // -----1


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

  // if (!tournament) {
  //   return (
  //     <div className="min-h-screen pt-16 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
  //         <p className="text-muted-foreground">Loading tournament...</p>
  //       </div>
  //     </div>
  //   );
  // }

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



          {invites.map(invite => (
  <Card key={invite.inviteId} className="p-4 mb-3">
    <p>{invite.from.name} invited you to join a tournament</p>

    <div className="flex gap-2 mt-2">
      <Button
        onClick={() =>
          ws?.send(JSON.stringify({
            type: "RESPOND_TOURNAMENT_INVITE",
            inviteId: invite.inviteId,
            accept: true
          }))
        }
      >
        <h1 style="color: red;">This is a red heading</h1>
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          ws?.send(JSON.stringify({
            type: "RESPOND_TOURNAMENT_INVITE",
            inviteId: invite.inviteId,
            accept: false
          }))
        }
      >
        Decline
      </Button>
    </div>
  </Card>
))}

        </div>


    {tournamentPhase === "SETUP" ? (
  <div className="max-w-4xl mx-auto space-y-8">
    <Button onClick={handleJoinTournament}>
      Join Tournament
    </Button>


    
  </div>

) : (
  <div className="max-w-6xl mx-auto">
    <TournamentBracket matches={matches} />
  </div>
)}


<input
  className="border p-2 rounded w-full"
  placeholder="Search player..."
  value={search}
  onChange={e => searchUsers(e.target.value)}
/>

<div className="space-y-2">
  {results.map(u => (
    <div key={u.id} className="flex justify-between">
      <span>{u.User_name}</span>
      
      <Button
        size="sm"
        onClick={() =>
          ws?.send(JSON.stringify({
            type: "INVITE_PLAYER",
            token: localStorage.getItem("token"),
            targetId: u.id,
            tournamentId: currentTournamentId
          }))
        }
      >
                <h1 style="color: red;">invite</h1>

      </Button>
    </div>
  ))}
</div>


        {/* was here */}

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






// {tournament.status === 'setup' ? (
//           /* Tournament Setup Phase */
//           <div className="max-w-4xl mx-auto space-y-8">
//             <PlayerForm
//               onAddPlayer={handleAddPlayer}
//               players={tournament.players}
//               minPlayers={2}
//               maxPlayers={8}
//             />

//             {tournament.players.length >= 2 && (
//               <Card className="bg-gradient-secondary border-border">
//                 <CardHeader>
//                   <CardTitle className="text-center font-game">Ready to Start?</CardTitle>
//                 </CardHeader>
//                 <CardContent className="text-center space-y-4">
//                   <p className="text-muted-foreground">
//                     {tournament.players.length} players registered. The tournament will generate a bracket automatically.
//                   </p>
//                   <Button
//                     onClick={handleStartTournament}
//                     size="lg"
//                     className="bg-gradient-primary hover:scale-105 transition-transform animate-pulse-glow font-game"
//                   >
//                     <Play className="w-6 h-6 mr-2" />
//                     START TOURNAMENT
//                   </Button>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         ) : (
//           /* Tournament Active Phase */
//           <div className="max-w-6xl mx-auto">
//             {/* NEW BRACKEEEETTTTTT */}
//             <TournamentBracket matches={matches} />

//           </div>
//         )}