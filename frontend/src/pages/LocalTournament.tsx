import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PongCanvas } from "@/components/PongCanvas";
import { ArrowLeft, Trophy } from "lucide-react";
import { toast } from "sonner";
import "@/css/LocalTournament.css";

interface Player {
  id: number;
  alias: string;
}

interface MatchState {
  player1: Player;
  player2: Player;
  round: number; 
  matchId: string;
}

type TournamentPhase = "setup" | "semifinals" | "finals" | "completed";

const LocalTournament = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<TournamentPhase>("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [aliases, setAliases] = useState<string[]>(["", "", "", ""]);
  const [currentMatch, setCurrentMatch] = useState<MatchState | null>(null);
  const [matchResults, setMatchResults] = useState<
    { matchId: string; winner: Player; loser: Player }[]
  >([]);
  const [semifinalWinners, setSemifinalWinners] = useState<Player[]>([]);
  const [tournamentWinner, setTournamentWinner] = useState<Player | null>(null);

  const handleAliasChange = (index: number, value: string) => {
    const newAliases = [...aliases];
    newAliases[index] = value;
    setAliases(newAliases);
  };

  const handleStartTournament = () => {
    if (aliases.some((a) => !a.trim())) {
      toast.error("All players must enter an alias!");
      return;
    }
    let map = new Set<String>();

    aliases.map((a) => {
        map.add(a);
    })
    if (map.size < 4)
     {
        toast.error("All players must enter a Unique alias!");
        return;
     }
    const newPlayers: Player[] = aliases.map((alias, i) => ({
      id: i + 1,
      alias: alias.trim(),
    }));

    setPlayers(newPlayers);

    const firstMatch: MatchState = {
      player1: newPlayers[0],
      player2: newPlayers[1],
      round: 1,
      matchId: "semi1",
    };

    setCurrentMatch(firstMatch);
    setPhase("semifinals");
  };

  const handleMatchEnd = (player1Score: number, player2Score: number) => {
    if (!currentMatch) return;

    const winner = player1Score > player2Score ? currentMatch.player1 : currentMatch.player2;
    const loser = player1Score > player2Score ? currentMatch.player2 : currentMatch.player1;

    const result = { matchId: currentMatch.matchId, winner, loser };
    
    setMatchResults(prev => [...prev, result]);

    if (currentMatch.matchId === "semi1") {
      setSemifinalWinners(prev => [...prev, winner]);
      const secondMatch: MatchState = {
        player1: players[2], 
        player2: players[3], 
        round: 1,
        matchId: "semi2",
      };
      setCurrentMatch(secondMatch);
    } else if (currentMatch.matchId === "semi2") {
      setSemifinalWinners(prev => [...prev, winner]);
      const finalMatch: MatchState = {
        player1: semifinalWinners[0],
        player2: winner,
        round: 2,
        matchId: "final",
      };
      setCurrentMatch(finalMatch);
      setPhase("finals");
    } else if (currentMatch.matchId === "final") {
      setTournamentWinner(winner);
      setCurrentMatch(null);
      setPhase("completed");
    }
  };

  const handleBackToSetup = () => {
    setPhase("setup");
    setCurrentMatch(null);
    setPlayers([]);
    setAliases(["", "", "", ""]);
    setMatchResults([]);
    setSemifinalWinners([]);
    setTournamentWinner(null);
  };

  return (
    <div className="game-page">
      <div className="game-container">
        {phase === "setup" ? (
          <div className="tournament-setup">
            <div className="game-header">
              <button
                onClick={() => navigate(-1)}
                variant="outline"
                className="back-button"
              >
                <ArrowLeft className="back-icon" />
                <span>Back</span>
              </button>
              <div style={{ paddingTop: "2rem" }} className="ai-game-title-container">
                <h1 className="ai-game-title glow-text">
                  <Trophy className="title-icon" />
                  Local Tournament
                </h1>
                <p className="ai-game-subtitle">4-Player Local Tournament</p>
              </div>
              <div className="header-spacer"></div>
            </div>

            <div className="setup-card">
              <div className="setup-card-header">
                <div className="setup-card-title">
                  <Trophy style={{ width: '24px', height: '24px', color: '#60a5fa' }} />
                  Player Setup
                </div>
              </div>
              <div className="setup-card-content">
                <div className="players-grid">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="player-input-group">
                      <label className="player-input-label">
                        Player {index + 1}
                      </label>
                      <input
                        type="text"
                        placeholder={`Enter alias...`}
                        value={aliases[index]}
                        onChange={(e) => handleAliasChange(index, e.target.value)}
                        className="player-input"
                        maxLength={20}
                      />
                    </div>
                  ))}
                </div>

                <div className="format-info">
                  <p className="format-info-title">Tournament Format</p>
                  <ul className="format-info-list">
                    <li><span>1.</span> First Match: Player 1 vs Player 2</li>
                    <li><span>2.</span> Second Match: Player 3 vs Player 4</li>
                    <li><span>3.</span> Grand Final: Winner 1 vs Winner 2</li>
                  </ul>
                  <div className="format-info-controls">
                    <p>
                      ⌨️ Controls: Player 1 (Arrows ↑↓) | Player 2 (W/S Keys)
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleStartTournament}
                  className="start-button"
                >
                  <Trophy style={{ width: '20px', height: '20px' }} />
                  Sart Tournament
                </button>
              </div>
            </div>
          </div>
        ) : currentMatch ? (
          <div className="tournament-match">
            <div className="game-header">
              <button
                onClick={handleBackToSetup}
                variant="outline"
                className="back-button"
              >
                <ArrowLeft className="back-icon" />
                <span>Back</span>
              </button>
              <div style={{ paddingTop: "2rem" }} className="ai-game-title-container">
                <h1 className="ai-game-title glow-text">
                  {currentMatch.round === 1
                    ? `${currentMatch.matchId === "semi1" ? "First Match" : "Second Match"}`
                    : "Grand Final"}
                </h1>
                <p className="ai-game-subtitle">
                  {currentMatch.player1.alias} vs {currentMatch.player2.alias}
                </p>
              </div>
              <div className="header-spacer"></div>
            </div>
            <div className={`game-canvas-container`}>
              <PongCanvas
                player1Name={currentMatch.player1.alias}
                player2Name={currentMatch.player2.alias}
                onGameEnd={handleMatchEnd}
                maxScore={5}
              />
            </div>
          </div>
        ) : phase === "completed" ? (
          <div className="tournament-match">
            <div className="game-header">
              <button
                onClick={handleBackToSetup}
                variant="outline"
                className="back-button"
              >
                <ArrowLeft className="back-icon" />
                <span>Back</span>
              </button>
              <div style={{ paddingTop: "2rem" }} className="ai-game-title-container">
                <h1 className="ai-game-title glow-text">
                  🏆 Tournament Winner 🏆
                </h1>
                <p className="ai-game-subtitle">
                  {tournamentWinner?.alias.toUpperCase()} REIGNS SUPREME!
                </p>
              </div>
              <div className="header-spacer"></div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60vh',
              fontSize: '4rem',
              fontWeight: 'bold',
              color: '#3b82f6',
              textShadow: '0 0 30px rgba(59, 130, 246, 0.6)',
              fontFamily: 'monospace'
            }}>
              {tournamentWinner?.alias.toUpperCase()}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LocalTournament;
