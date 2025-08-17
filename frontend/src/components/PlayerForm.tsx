import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Plus } from "lucide-react";
import { Player } from "@/lib/api";

interface PlayerFormProps {
  onAddPlayer: (alias: string) => void;
  players: Player[];
  minPlayers?: number;
  maxPlayers?: number;
}

export const PlayerForm = ({ 
  onAddPlayer, 
  players, 
  minPlayers = 2, 
  maxPlayers = 8 
}: PlayerFormProps) => {
  const [alias, setAlias] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!alias.trim()) {
      setError("Player alias is required");
      return;
    }
    
    if (players.some(p => p.alias.toLowerCase() === alias.toLowerCase())) {
      setError("This alias is already taken");
      return;
    }
    
    if (players.length >= maxPlayers) {
      setError(`Maximum ${maxPlayers} players allowed`);
      return;
    }
    
    onAddPlayer(alias.trim());
    setAlias("");
    setError("");
  };

  const canAddMore = players.length < maxPlayers;
  const canStart = players.length >= minPlayers;

  return (
    <Card className="bg-gradient-secondary border-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 font-game">
          <User className="w-5 h-5 text-primary" />
          <span>Player Registration</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Player Form */}
        {canAddMore && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="alias" className="font-medium">
                Player Alias
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="alias"
                  placeholder="Enter player name..."
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  className="bg-card border-border focus:border-primary"
                  maxLength={20}
                />
                <Button 
                  type="submit" 
                  size="icon"
                  className="bg-gradient-primary hover:scale-105 transition-transform"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {error && (
                <p className="text-destructive text-sm">{error}</p>
              )}
            </div>
          </form>
        )}

        {/* Player List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              Players ({players.length}/{maxPlayers})
            </h3>
            {canStart && (
              <span className="text-accent text-sm font-medium">
                Ready to start!
              </span>
            )}
          </div>
          
          {players.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No players registered yet</p>
              <p className="text-sm">Add at least {minPlayers} players to start</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {players.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center space-x-3 p-3 bg-card rounded-lg border border-border"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <span className="font-medium">{player.alias}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Info */}
        <div className="text-center text-sm text-muted-foreground">
          {!canStart && (
            <p>Need {minPlayers - players.length} more player{minPlayers - players.length !== 1 ? 's' : ''} to start</p>
          )}
          {!canAddMore && (
            <p>Maximum players reached</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
