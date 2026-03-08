import { fetchWithAuth } from './tokenRefresh';

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

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost';
class UserAPI {


  
  private baseUrl = `${API_URL}/api/users`;
  
  async updateUsername(current_password: string, new_username: string) {
    const res = await fetchWithAuth(`${this.baseUrl}/update_username`, {
      method: "PUT",
      body: JSON.stringify({ current_password, new_username }),
      credentials: 'include',
    });
        return await res.json();
  }
  async register(email: string, password: string, name: string) {
    const res = await fetch(`${this.baseUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const response = await res.json();

    if (res.ok) {
      try {
        await fetch(`${API_URL}/api/chat/users/add`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: response.id, username: name })
        });
      } catch (err) {
        console.error('Failed to add user to chat:', err);
      }
      
      return response;
    } else {
      throw new Error(response.message || "Registration failed");
    }
  }

  async login(email: string, password: string) {
    const res = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    return await res.json();
  }

  async logout(email: string) {
    const res = await fetchWithAuth(`${this.baseUrl}/logout`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    return await res.json();
  }

  async update_email(new_email: string, password: string) {
    const res = await fetchWithAuth(`${this.baseUrl}/update_email`, {
      method: "PUT",
      body: JSON.stringify({ new_email, password }),
      credentials: 'include',
    });

    return await res.json();
  }

  async update_password(current_password: string, new_password: string) {
    const res = await fetchWithAuth(`${this.baseUrl}/update_password`, {
      method: "PUT",
      body: JSON.stringify({
        current_password,
        new_password,
      }),
      credentials: "include",
    });

    return await res.json();
  }

  async me() {
    const res = await fetchWithAuth(`${this.baseUrl}/me`, {
      method: "GET",
    });

    return await res.json();
  }
  async update_image(imageData: { 
    image: string;      
    image_name: string; 
    file_type?: string;
    file_size?: number;
  }) {
    const res = await fetchWithAuth(`${this.baseUrl}/update_image`, {
      method: "PUT",
      body: JSON.stringify({
        image: imageData.image,
        image_name: imageData.image_name,
        ...(imageData.file_type && { file_type: imageData.file_type }),
        ...(imageData.file_size && { file_size: imageData.file_size }),
      }),
      credentials: 'include',
    });

    return await res.json();
  }

  async getUserById(userId: string) {
    const res = await fetchWithAuth(`/api/dashboard/${userId}`, {
      method: "GET",
      credentials: 'include',
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Get user by ID error:", res.status, errorText);
      throw new Error(`Failed to fetch user: ${res.statusText}`);
    }

    const data = await res.json();
    return data.user;
  }

  async searchByName(name: string) {
    const res = await fetchWithAuth(`/api/users/search-this-name`, {
      method: "POST",
      body: JSON.stringify({ name }),
      credentials: 'include',
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.error || "User not found");
    }

    const data = await res.json();

    let avatar = "";
    try {
      const infoRes = await fetchWithAuth(`/api/users/user-info/${data.user_id}`, {
        method: "GET",
        credentials: 'include',
      });
      if (infoRes.ok) {
        const infoData = await infoRes.json();
        avatar = infoData.avatar || "";
      }
    } catch {
      // keep search working even if avatar fetch fails
    }

    return {
      user: {
        id: data.user_id,
        User_name: data.user_name,
        email: data.user_email,
        avatar,
      },
      statistics: null,
      lastMatch: null,
    };
  }

  // Fetch user data from auth service
  async getAuthUserById(userId: string) {
    const res = await fetchWithAuth(`/api/users/user-info/${userId}`, {
      method: "GET",
      credentials: 'include',
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Get auth user error:", res.status, errorText);
      throw new Error(`Failed to fetch user from auth service: ${res.statusText}`);
    }

    const data = await res.json();
    // Map auth service fields to expected format
    return {
      id: data.id,
      email: data.email,
      User_name: data.name,
      avatar: data.avatar,
      isOnline: data.loggedIn,
      Auto_Match: data.Auto_Match,
      CreatedAt: data.CreatedAt
    };
  }
}

export const userApi = new UserAPI();

