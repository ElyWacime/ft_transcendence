import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { playerDashboardApi_ayoub } from "@/lib/api_ayoub";
import { Trophy, User, TrendingUp, Gamepad2, Award, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import "../css/dashboard.css";

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
    if (!identifier && !isLoggedIn) {
      navigate("/login");
      return;
    }


    const fetchDashboardData = async () => {
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
        setAvatarKey(Date.now());
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

  useEffect(() => {
    const handleAvatarUpdate = () => {
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

    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    return () => window.removeEventListener('avatarUpdated', handleAvatarUpdate);
  }, [identifier, loading]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="loading-state">
        <Card className="error-card">
          <p className="error-message">{error || "Failed to load dashboard"}</p>
        </Card>
      </div>
    );
  }

  const { user, statistics, lastMatch } = dashboardData;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {}
        <div className="dashboard-header">
          <h1 className="dashboard-title glow-text">
            <Trophy className="dashboard-title-icon" />
            <span>Player Dashboard</span>
          </h1>
        </div>

        <div className="dashboard-grid">
          {}
          <Card className="dashboard-card">
            <div className="profile-container">
              <Avatar key={avatarKey} className="profile-avatar">
                <AvatarImage src={avatarSrc} />
                <AvatarFallback>
                  {user.User_name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="profile-name">{user.User_name || "Player"}</h2>
                <p className="profile-email">{user.email}</p>
              </div>
            </div>
          </Card>

          {}
          <Card className="dashboard-card">
            <div className="stat-section">
              <h3 className="section-title">
                <TrendingUp className="stat-icon" />
                <span>Statistics</span>
              </h3>
              <div className="dashboard-stats">
                <div className="stat-row">
                  <span className="stat-label">Total Matches</span>
                  <span className="stat-value">{statistics.totalMatches}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Wins</span>
                  <span className="stat-value stat-value-success">{statistics.totalWins}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Losses</span>
                  <span className="stat-value stat-value-danger">{statistics.totalLosses}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Win Rate</span>
                  <span className="stat-value stat-value-primary">{statistics.winRate}%</span>
                </div>
              </div>
            </div>
          </Card>

          {}
          <Card className="dashboard-card">
            <div className="card-sections">
              <div className="card-section">
                <h3 className="section-title">
                  <Gamepad2 className="stat-icon" />
                  <span>Last Match</span>
                </h3>
                {lastMatch ? (
                  <div className="match-details">
                    <div className="stat-row">
                      <span className="stat-label">Status</span>
                      <span className={`badge-status ${lastMatch.gameStatus === 'FINISHED' ? 'finished' : 'pending'}`}>
                        {lastMatch.gameStatus}
                      </span>
                    </div>
                    <div className="match-scores">
                      <div className="stat-row">
                        <span className="player-name">{lastMatch.player1Name || "Player 1"}</span>
                        <span className="stat-value">{lastMatch.score1 || 0}</span>
                      </div>
                      <div className="stat-row">
                        <span className="player-name">{lastMatch.player2Name || "Player 2"}</span>
                        <span className="stat-value">{lastMatch.score2 || 0}
                        </span>
                      </div>
                    </div>
                    {lastMatch.Winner_Id && (
                      <div className="stat-row stat-row-emphasis">
                        <span className="stat-label">
                          <Award className="award-icon" />
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
                  <p className="empty-state-text">No matches played yet</p>
                )}
              </div>

              <div className="card-section">
                <h3 className="section-title">
                  <User className="stat-icon" />
                  <span>Account Information</span>
                </h3>
                <div className="dashboard-stats">
                  <div className="stat-row">
                    <span className="stat-label">Member since</span>
                    <span className="stat-value">{new Date(user.CreatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="card-section">
                <h3 className="section-title">
                  <Users className="stat-icon" />
                  <span>Performance</span>
                </h3>
                <div className="dashboard-stats">
                  <div className="stat-row">
                    <span className="stat-label">Total Games</span>
                    <span className="stat-value">{statistics.totalMatches}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Win Percentage</span>
                    <span className="stat-value stat-value-primary">{statistics.winRate}%</span>
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