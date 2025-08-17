export interface Player {
  id: string;
  alias: string;
  score: number;
  wins: number;
  losses: number;
}

export interface Match {
  id: string;
  player1: Player;
  player2: Player;
  winner?: Player;
  score1: number;
  score2: number;
  status: 'pending' | 'playing' | 'completed';
  round: number;
}

export interface Tournament {
  id: string;
  name: string;
  players: Player[];
  matches: Match[];
  currentMatch?: Match;
  status: 'setup' | 'active' | 'completed';
  winner?: Player;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerAlias: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'system';
}

// Mock API functions (replace with real API calls later)
class TournamentAPI {
  private mockTournament: Tournament | null = null;
  private mockMessages: ChatMessage[] = [];

  async createTournament(name: string): Promise<Tournament> {
    this.mockTournament = {
      id: Date.now().toString(),
      name,
      players: [],
      matches: [],
      status: 'setup'
    };
    return this.mockTournament;
  }

  async addPlayer(alias: string): Promise<Player> {
    if (!this.mockTournament) throw new Error('No tournament active');
    
    const player: Player = {
      id: Date.now().toString(),
      alias,
      score: 0,
      wins: 0,
      losses: 0
    };
    
    this.mockTournament.players.push(player);
    return player;
  }

  async startTournament(): Promise<Tournament> {
    if (!this.mockTournament) throw new Error('No tournament active');
    
    // Generate bracket matches
    const players = [...this.mockTournament.players];
    const matches: Match[] = [];
    
    for (let i = 0; i < players.length; i += 2) {
      if (players[i + 1]) {
        matches.push({
          id: `match-${i / 2}`,
          player1: players[i],
          player2: players[i + 1],
          score1: 0,
          score2: 0,
          status: 'pending',
          round: 1
        });
      }
    }
    
    this.mockTournament.matches = matches;
    this.mockTournament.status = 'active';
    this.mockTournament.currentMatch = matches[0];
    
    return this.mockTournament;
  }

  async updateMatchResult(matchId: string, score1: number, score2: number): Promise<Match> {
    if (!this.mockTournament) throw new Error('No tournament active');
    
    const match = this.mockTournament.matches.find(m => m.id === matchId);
    if (!match) throw new Error('Match not found');
    
    match.score1 = score1;
    match.score2 = score2;
    match.winner = score1 > score2 ? match.player1 : match.player2;
    match.status = 'completed';
    
    // Update player stats
    match.player1.score += score1;
    match.player2.score += score2;
    if (match.winner === match.player1) {
      match.player1.wins++;
      match.player2.losses++;
    } else {
      match.player2.wins++;
      match.player1.losses++;
    }
    
    return match;
  }

  async getTournament(): Promise<Tournament | null> {
    return this.mockTournament;
  }

  async sendMessage(playerId: string, playerAlias: string, message: string): Promise<ChatMessage> {
    const chatMessage: ChatMessage = {
      id: Date.now().toString(),
      playerId,
      playerAlias,
      message,
      timestamp: new Date(),
      type: 'message'
    };
    
    this.mockMessages.push(chatMessage);
    return chatMessage;
  }

  async getMessages(): Promise<ChatMessage[]> {
    return [...this.mockMessages];
  }

  async sendSystemMessage(message: string): Promise<ChatMessage> {
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      playerId: 'system',
      playerAlias: 'System',
      message,
      timestamp: new Date(),
      type: 'system'
    };
    
    this.mockMessages.push(systemMessage);
    return systemMessage;
  }
}

export const api = new TournamentAPI();
