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
  status: "pending" | "playing" | "completed";
  round: number;
}

export interface Tournament {
  id: string;
  name: string;
  players: Player[];
  matches: Match[];
  currentMatch?: Match;
  status: "setup" | "active" | "completed";
  winner?: Player;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerAlias: string;
  message: string;
  timestamp: Date;
  type: "message" | "system";
}

// ---------------- MOCK TOURNAMENT API ---------------- //
class TournamentAPI {
  private mockTournament: Tournament | null = null;
  private mockMessages: ChatMessage[] = [];

  async createTournament(name: string): Promise<Tournament> {
    this.mockTournament = {
      id: Date.now().toString(),
      name,
      players: [],
      matches: [],
      status: "setup",
    };
    return this.mockTournament;
  }

  async addPlayer(alias: string): Promise<Player> {
    if (!this.mockTournament) throw new Error("No tournament active");

    const player: Player = {
      id: Date.now().toString(),
      alias,
      score: 0,
      wins: 0,
      losses: 0,
    };

    this.mockTournament.players.push(player);
    return player;
  }

  async startTournament(): Promise<Tournament> {
    if (!this.mockTournament) throw new Error("No tournament active");

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
          status: "pending",
          round: 1,
        });
      }
    }

    this.mockTournament.matches = matches;
    this.mockTournament.status = "active";
    this.mockTournament.currentMatch = matches[0];

    return this.mockTournament;
  }

  async updateMatchResult(
    matchId: string,
    score1: number,
    score2: number,
  ): Promise<Match> {
    if (!this.mockTournament) throw new Error("No tournament active");

    const match = this.mockTournament.matches.find((m) => m.id === matchId);
    if (!match) throw new Error("Match not found");

    match.score1 = score1;
    match.score2 = score2;
    match.winner = score1 > score2 ? match.player1 : match.player2;
    match.status = "completed";

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

  async sendMessage(
    playerId: string,
    playerAlias: string,
    message: string,
  ): Promise<ChatMessage> {
    const chatMessage: ChatMessage = {
      id: Date.now().toString(),
      playerId,
      playerAlias,
      message,
      timestamp: new Date(),
      type: "message",
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
      playerId: "system",
      playerAlias: "System",
      message,
      timestamp: new Date(),
      type: "system",
    };

    this.mockMessages.push(systemMessage);
    return systemMessage;
  }
}

export const api = new TournamentAPI();

// ---------------- USER AUTH API ---------------- //
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost';
class UserAPI {
  private baseUrl = `${API_URL}/api/users`;

  async register(email: string, password: string, name: string) {
    const res = await fetch(`${this.baseUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    return await res.json();
  }

  async login(email: string, password: string) {
    const res = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    return await res.json();
  }

  async logout(email: string) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${this.baseUrl}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });

    return await res.json();
  }

  async update_email(new_email: string, password: string) {
    const res = await fetch(`${this.baseUrl}/update_email`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ new_email, password }),
      credentials: 'include',
    });

    return await res.json();
  }

  async update_password(current_password: string, new_password: string) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${this.baseUrl}/update_password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password,
        new_password,
      }),
      credentials: "include",
    });

    return await res.json();
  }

  async me() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${this.baseUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return await res.json();
  }
  async update_image(imageData: { 
    image: string;       // Base64 string (without data: prefix)
    image_name: string;  // File name
    file_type?: string;  // Optional
    file_size?: number;  // Optional
  }) {
    const token = localStorage.getItem("token");
    
    const res = await fetch(`${this.baseUrl}/update_image`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",  // Important: JSON not FormData
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        image: imageData.image,
        image_name: imageData.image_name,
        // Optionally include other fields if your backend accepts them
        ...(imageData.file_type && { file_type: imageData.file_type }),
        ...(imageData.file_size && { file_size: imageData.file_size }),
      }),
      credentials: 'include',
    });

    return await res.json();
  }

  // async update_image_alternative(image: File, description?: string) {
  //   const token = localStorage.getItem("token");
    
  //   const formData = new FormData();
  //   formData.append('image', image);
    
  //   if (description) {
  //     formData.append('description', description);
  //   }
    
  //   const res = await fetch(`${this.baseUrl}/update_image`, {
  //     method: "PUT",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: formData,
  //     credentials: 'include',
  //   });

  //   return await res.json();
  // }

  // async update_image_json(imageData: { image: string; type?: string }) {
  //   const token = localStorage.getItem("token");
    
  //   const res = await fetch(`${this.baseUrl}/update_image`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify(imageData),
  //     credentials: 'include',
  //   });

  //   return await res.json();
  // }
}

export const userApi = new UserAPI();

