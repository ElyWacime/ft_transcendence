// ---------------- PLAYER DASHBOARD API ---------------- //
class PlayerDashboardAPI_ayoub {
  // Use gateway URL which works both in Docker and local development
  // The gateway (nginx) will proxy to pong-server:3000
  private baseUrl = "/api";

  async getPlayerDashboard(playerId: string) {
    const url = `${this.baseUrl}/dashboard/${playerId}`;
    
    // Get JWT token from localStorage to send with request
    const token = localStorage.getItem("token");
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      if (!res.ok) {
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

