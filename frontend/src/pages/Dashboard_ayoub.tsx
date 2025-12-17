import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { playerDashboardApi_ayoub } from "@/lib/api_ayoub";
import { Trophy, User, TrendingUp, Gamepad2, Award, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Helper function to decode JWT token and get user ID
function getUserIdFromToken(): string | null {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    // Decode JWT token (base64 decode the payload)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.id || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

interface DashboardData {
  user: {
    id: string;
    email: string;
    User_name: string;
    avatar: string;
    isOnline: boolean;
    Auto_Match: boolean;
    CreatedAt: string;
  };
  statistics: {
    totalMatches: number;
    totalWins: number;
    totalLosses: number;
    winRate: number;
    tournamentParticipations: number;
  };
  lastMatch: any | null;
}

const Dashboard_ayoub = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If no ID in URL and user is not logged in, redirect to login
    if (!id && !isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Use ID from URL if provided, otherwise extract from JWT token
        let userId = id;
        
        if (!userId) {
          userId = getUserIdFromToken();
          if (!userId) {
            setError("Unable to get user ID. Please provide an ID in the URL or log in.");
            setLoading(false);
            return;
          }
        }

        console.log("Fetching dashboard for user ID:", userId);
        const data = await playerDashboardApi_ayoub.getPlayerDashboard(userId);
        setDashboardData(data);
      } catch (err: any) {
        console.error("Failed to fetch dashboard:", err);
        console.error("Error details:", err.message);
        // Check if it's a 404 (user not found) or other error
        if (err.message.includes("Not Found") || err.message.includes("404")) {
          setError(`User not found. User ID: ${userId}. Please make sure you're logged in with a valid account.`);
        } else {
          setError(err.message || "Failed to load dashboard data");
        }
        toast.error(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [id, isLoggedIn, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-secondary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-secondary">
        <Card className="p-8 max-w-md">
          <p className="text-destructive text-center">{error || "Failed to load dashboard"}</p>
        </Card>
      </div>
    );
  }

  const { user, statistics, lastMatch } = dashboardData;

  return (
    <div className="min-h-screen pt-16 bg-gradient-secondary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-6xl font-game font-bold glow-text flex items-center justify-center space-x-3">
            <Trophy className="w-8 h-8 text-primary" />
            <span>Player Dashboard</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* User Profile Card */}
          <Card className="p-6 bg-background/60 backdrop-blur-sm border border-border">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar || "https://www.gravatar.com/avatar/"} />
                <AvatarFallback>{user.User_name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user.User_name || "Player"}</h2>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span className="text-sm text-muted-foreground">
                  {user.isOnline ? "Online" : "Offline"}
                </span>
              </div>
              {user.Auto_Match && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  Auto Match Enabled
                </span>
              )}
            </div>
          </Card>

          {/* Statistics Cards */}
          <Card className="p-6 bg-background/60 backdrop-blur-sm border border-border">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Statistics</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Matches</span>
                  <span className="font-bold text-lg">{statistics.totalMatches}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Wins</span>
                  <span className="font-bold text-lg text-green-500">{statistics.totalWins}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Losses</span>
                  <span className="font-bold text-lg text-red-500">{statistics.totalLosses}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Win Rate</span>
                  <span className="font-bold text-lg text-primary">{statistics.winRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tournaments</span>
                  <span className="font-bold text-lg">{statistics.tournamentParticipations}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Last Match Card */}
          <Card className="p-6 bg-background/60 backdrop-blur-sm border border-border">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center space-x-2">
                <Gamepad2 className="w-5 h-5 text-primary" />
                <span>Last Match</span>
              </h3>
              {lastMatch ? (
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Status: <span className={`font-semibold ${lastMatch.gameStatus === 'FINISHED' ? 'text-green-500' : 'text-yellow-500'}`}>
                      {lastMatch.gameStatus}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{lastMatch.player1Name || "Player 1"}</span>
                      <span className="font-bold">{lastMatch.score1 || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{lastMatch.player2Name || "Player 2"}</span>
                      <span className="font-bold">{lastMatch.score2 || 0}</span>
                    </div>
                  </div>
                  {lastMatch.Winner_Id && (
                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center space-x-2 text-sm">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-muted-foreground">Winner: </span>
                        <span className="font-semibold">
                          {lastMatch.Winner_Id === lastMatch.P1_Id ? lastMatch.player1Name : 
                           lastMatch.Winner_Id === lastMatch.P2_Id ? lastMatch.player2Name : 
                           "Unknown"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No matches played yet</p>
              )}
            </div>
          </Card>
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 max-w-6xl mx-auto">
          <Card className="p-6 bg-background/60 backdrop-blur-sm border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <span>Account Information</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member since:</span>
                    <span>{new Date(user.CreatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User ID:</span>
                    <span className="font-mono text-xs">{user.id}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Performance</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Games:</span>
                    <span className="font-semibold">{statistics.totalMatches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Win Percentage:</span>
                    <span className="font-semibold text-primary">{statistics.winRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard_ayoub;

