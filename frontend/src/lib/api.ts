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

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost';
class UserAPI {
    
  private baseUrl = `${API_URL}/api/users`;
  
  async updateUsername(current_password: string, new_username: string, accessToken: string, updateAccessToken: (newToken: string) => void) {
    const res = await fetchWithAuth(`${this.baseUrl}/update_username`, {
      method: "PUT",
      body: JSON.stringify({ current_password, new_username }),
      credentials: 'include',
    }, accessToken, updateAccessToken);
    if (res.ok) {
      const res = await fetchWithAuth(`${API_URL}/api/chat/user/update`, {
        method: "POST",
        body: JSON.stringify({ username: new_username }),
        credentials: 'include',
      }, accessToken, updateAccessToken);
    }

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

  async getUserById(userId: string, accessToken: string, updateAccessToken: (newToken: string) => void) {
    const res = await fetchWithAuth(`/api/dashboard/${userId}`, {
      method: "GET",
      credentials: 'include',
    },accessToken, updateAccessToken);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Get user by ID error:", res.status, errorText);
      throw new Error(`Failed to fetch user: ${res.statusText}`);
    }

    const data = await res.json();
    return data.user;
  }

  async searchByName(name: string, accessToken: string, updateAccessToken: (newToken: string) => void) {
    const res = await fetchWithAuth(`/api/users/search-this-name`, {
      method: "POST",
      body: JSON.stringify({ name }),
      credentials: 'include',
    }, accessToken, updateAccessToken);
    
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
      }, accessToken, updateAccessToken);
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

