import { fetchWithAuth } from './tokenRefresh';

interface UserData {
  id: string;
  email: string;
  User_name: string;
  avatar: string;
  isOnline: boolean;
  Auto_Match: boolean;
  CreatedAt: string;
}

interface GameStatistics {
  totalMatches: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  totalTournaments?: number;
  totalTourWins?: number;
}

interface CombinedUserData {
  user: UserData;
  statistics: GameStatistics;
  lastMatch: any | null;
}

class PlayerDashboardAPI_ayoub {

  private baseUrl = "/api";

  // Main method: Fetch ALL data combined (auth + game)
  async getCompleteUserData(userId: string, accessToken: string, updateAccessToken: (newToken: string) => void): Promise<CombinedUserData> {
    try {
      // First fetch auth data (supports both ID and username lookup)
      const authRes = await fetchWithAuth(`/api/users/user-info/${encodeURIComponent(userId)}`, { method: "GET" }, accessToken, updateAccessToken);

      if (!authRes.ok) {
        const errorText = await authRes.text();
        console.error("Auth API Error:", authRes.status, errorText);
        if (authRes.status === 404) {
          throw new Error("User not found. Please check the username or ID.");
        }
        throw new Error(`Failed to fetch user data (${authRes.status})`);
      }

      const authData = await authRes.json();

      // Use the resolved ID for the game service (which needs the actual user ID)
      const resolvedId = authData.id || userId;
      const gameRes = await fetchWithAuth(`${this.baseUrl}//dashboard/${resolvedId}`, { method: "GET" },accessToken, updateAccessToken);

      if (!gameRes.ok) {
        const errorText = await gameRes.text();
        console.error("Game API Error:", gameRes.status, errorText);
        throw new Error(`Failed to fetch game data: ${gameRes.statusText}`);
      }

      const gameData = await gameRes.json();

      // Combine all data with proper field mapping
      return {
        user: {
          id: authData.id || "",
          email: authData.email || "",
          User_name: authData.name || "Player",
          avatar: authData.avatar || "",
          isOnline: authData.loggedIn || false,
          Auto_Match: authData.Auto_Match || false,
          CreatedAt: authData.CreatedAt || new Date().toISOString(),
        },
        statistics: gameData.statistics || {
          totalMatches: 0,
          totalWins: 0,
          totalLosses: 0,
          winRate: 0,
          totalTournaments: 0,
          totalTourWins: 0,
        },
        lastMatch: gameData.lastMatch || null
      };
    } catch (error: any) {
      // console.error("Complete User Data Fetch Error:", error);
      throw error;
    }
  }

  // Alias for backward compatibility
  async getPlayerDashboard(identifier: string, accessToken: string, updateAccessToken: (newToken: string) => void) {
    return this.getCompleteUserData(identifier, accessToken, updateAccessToken);
  }
}

export const playerDashboardApi_ayoub = new PlayerDashboardAPI_ayoub();

