import { fetchWithAuth } from './tokenRefresh';

interface UserData {
  id: string;
  email: string;
  User_name: string;
  avatar: string;
  isOnline: boolean;
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

  async getCompleteUserData(userName: string, accessToken: string, updateAccessToken: (newToken: string) => void): Promise<CombinedUserData> {
    try {
      const searchRes = await fetchWithAuth(`/api/users/search-this-name`, {
        method: "POST",
        body: JSON.stringify({ name: userName }),
      }, accessToken, updateAccessToken);

      if (!searchRes.ok) {
        throw new Error(`User "${userName}" not found`);
      }

      const searchData = await searchRes.json();
      const userId = searchData.user_id;

      const authRes = await fetchWithAuth(`/api/users/user-info/${encodeURIComponent(userId)}`, { method: "GET" }, accessToken, updateAccessToken);

      if (!authRes.ok) {
        throw new Error("Failed to fetch user data");
      }

      const authData = await authRes.json();

      const gameRes = await fetchWithAuth(`${this.baseUrl}/dashboard/${userId}`, { method: "GET" }, accessToken, updateAccessToken);

      if (!gameRes.ok) {
        throw new Error(`Failed to fetch game data (${gameRes.status})`);
      }

      const gameData = await gameRes.json();

      return {
        user: {
          id: authData.id || "",
          email: authData.email || "",
          User_name: authData.name || "Player",
          avatar: authData.avatar || "",
          isOnline: authData.loggedIn || false,
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
      throw error;
    }
  }
}

export const playerDashboardApi_ayoub = new PlayerDashboardAPI_ayoub();

