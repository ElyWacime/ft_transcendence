import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { playerDashboardApi_ayoub } from "@/lib/api_ayoub";
import { Trophy, User, TrendingUp, Gamepad2, Award, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import "../css/dashboard.css";

// Helper function to decode JWT token and get user ID
function getUserIdFromToken(): string | null {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
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
  };
  lastMatch: any | null;
}

const Dashboard_ayoub = () => {
  const navigate = useNavigate();
  const { identifier } = useParams<{ identifier?: string }>();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const avatarSrc = dashboardData?.user.avatar?.startsWith("data:image")
? dashboardData?.user.avatar
: `${dashboardData?.user.avatar || "https://www.gravatar.com/avatar/"}?t=${avatarKey}`;

  useEffect(() => {
    // If no identifier in URL and user is not logged in, redirect to login
    if (!identifier && !isLoggedIn) {
      navigate("/login");
      return;
    }


    const fetchDashboardData = async () => {
      // Use identifier from URL if provided, otherwise extract user ID from JWT token
      let userIdentifier = identifier;
      
      if (!userIdentifier) {
        userIdentifier = getUserIdFromToken();
        if (!userIdentifier) {
          setError("Unable to get user ID. Please provide a username/ID in the URL or log in.");
          setLoading(false);
          return;
        }
      }

      try {
        console.log("Fetching dashboard for user:", userIdentifier);
        const data = await playerDashboardApi_ayoub.getPlayerDashboard(userIdentifier);
        
        setDashboardData(data);
        setAvatarKey(Date.now()); // Force avatar refresh
      } catch (err: any) {
        console.error("Failed to fetch dashboard:", err);
        console.error("Error details:", err.message);
        if (err.message.includes("Not Found") || err.message.includes("404")) {
          setError(`User not found. Identifier: ${userIdentifier}. Please make sure the username or ID is correct.`);
        } else {
          setError(err.message || "Failed to load dashboard data");
        }
        toast.error(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [identifier, isLoggedIn, navigate]);

  // Refetch dashboard data when avatar is updated
  useEffect(() => {
    const handleAvatarUpdate = () => {
      // Refetch dashboard data to get updated avatar from database
      const userIdentifier = identifier || getUserIdFromToken();
      if (userIdentifier && !loading) {
        playerDashboardApi_ayoub.getPlayerDashboard(userIdentifier)
          .then(data => {
            setDashboardData(data);
            setAvatarKey(Date.now());
          })
          .catch(err => console.error('Failed to refresh avatar:', err));
      }
    };

    // Listen for custom avatar update event
    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    return () => window.removeEventListener('avatarUpdated', handleAvatarUpdate);
  }, [identifier, loading]);

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
    <div className="dashboard-page">
      <div className="container mx-auto px-4 py-8 mt-10">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="text-4xl md:text-6xl font-game font-bold glow-text flex items-center justify-center space-x-3">
            <Trophy className="w-8 h-8 text-primary" />
            <span>Player Dashboard</span>
          </h1>
        </div>

        <div className="dashboard-grid">
          {/* User Profile Card */}
          <Card className="dashboard-card">
            <div className="flex flex-col items-center text-center gap-4">
              <Avatar key={avatarKey} className="w-24 h-24 border-4 border-primary/20">
                <AvatarImage src={avatarSrc} />
                <AvatarFallback>
                  {user.User_name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user.User_name || "Player"}</h2>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
            </div>
          </Card>

          {/* Statistics Cards */}
          <Card className="dashboard-card">
            <div className="space-y-4">
              <h3 className="section-title">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Statistics</span>
              </h3>
              <div className="dashboard-stats">
                <div className="stat-row">
                  <span className="text-muted-foreground">Total Matches</span>
                  <span className="stat-value">{statistics.totalMatches}</span>
                </div>
                <div className="stat-row">
                  <span className="text-muted-foreground">Wins</span>
                  <span className="stat-value text-green-500">{statistics.totalWins}</span>
                </div>
                <div className="stat-row">
                  <span className="text-muted-foreground">Losses</span>
                  <span className="stat-value text-red-500">{statistics.totalLosses}</span>
                </div>
                <div className="stat-row">
                  <span className="text-muted-foreground">Win Rate</span>
                  <span className="stat-value text-primary">{statistics.winRate}%</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Last Match, Account, Performance */}
          <Card className="dashboard-card">
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="section-title">
                  <Gamepad2 className="w-5 h-5 text-primary" />
                  <span>Last Match</span>
                </h3>
                {lastMatch ? (
                  <div className="space-y-3">
                    <div className="stat-row">
                      <span className="stat-label">Status</span>
                      <span className={`badge-status ${lastMatch.gameStatus === 'FINISHED' ? 'finished' : 'pending'}`}>
                        {lastMatch.gameStatus}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="stat-row">
                        <span className="text-sm">{lastMatch.player1Name || "Player 1"}</span>
                        <span className="stat-value">{lastMatch.score1 || 0}</span>
                      </div>
                      <div className="stat-row">
                        <span className="text-sm">{lastMatch.player2Name || "Player 2"}</span>
                        <span className="stat-value">{lastMatch.score2 || 0}
                        </span>
                      </div>
                    </div>
                    {lastMatch.Winner_Id && (
                      <div className="stat-row stat-row-emphasis">
                        <span className="stat-label flex items-center gap-2">
                          <Award className="w-4 h-4 text-yellow-500" />
                          Winner
                        </span>
                        <span className="stat-value">
                          {lastMatch.Winner_Id === lastMatch.P1_Id ? lastMatch.player1Name : 
                           lastMatch.Winner_Id === lastMatch.P2_Id ? lastMatch.player2Name : 
                           "Unknown"}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No matches played yet</p>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="section-title">
                  <User className="w-5 h-5 text-primary" />
                  <span>Account Information</span>
                </h3>
                <div className="dashboard-stats">
                  <div className="stat-row">
                    <span className="stat-label">Member since</span>
                    <span className="stat-value">{new Date(user.CreatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="section-title">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Performance</span>
                </h3>
                <div className="dashboard-stats">
                  <div className="stat-row">
                    <span className="stat-label">Total Games</span>
                    <span className="stat-value">{statistics.totalMatches}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Win Percentage</span>
                    <span className="stat-value text-primary">{statistics.winRate}%</span>
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