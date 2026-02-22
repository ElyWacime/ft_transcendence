import { fetchWithAuth } from './tokenRefresh';

class PlayerDashboardAPI_ayoub {

  private baseUrl = "/api";

  async getPlayerDashboard(identifier: string) {
    const url = `${this.baseUrl}/dashboard/${identifier}`;
    
    try {
      const res = await fetchWithAuth(url, {
        method: "GET",
      });

      if (!res.ok)
        {
        const errorText = await res.text();
        console.error("Dashboard API Error:", res.status, errorText);
        let errorMessage = `Failed to fetch dashboard: ${res.statusText}`;
        if (res.status === 404) {
          errorMessage = `User not found. The user ID may not exist in the database.`;
        }
        throw new Error(errorMessage);
      }

      return await res.json();
    } catch (error: any) {
      console.error("Dashboard API Fetch Error:", error);
      throw error;
    }
  }
}

export const playerDashboardApi_ayoub = new PlayerDashboardAPI_ayoub();

