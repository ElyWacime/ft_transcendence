import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { playerDashboardApi_ayoub } from "@/lib/api_ayoub";
import { Trophy, User, TrendingUp, Gamepad2, Award, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import "./Dashboard.css";

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
    tournamentParticipations: number;
  };
  lastMatch: any | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  
  const avatarSrc = dashboardData?.user.avatar?.startsWith("data:image")
    ? dashboardData?.user.avatar
    : `${dashboardData?.user.avatar || "https://www.gravatar.com/avatar/"}?t=${avatarKey}`;

  useEffect(() => {
    if (!id && !isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
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
        
        const localAvatar = localStorage.getItem("avatar_url");
        if (localAvatar && data.user) {
          data.user.avatar = localAvatar;
        }
        
        setDashboardData(data);
        setAvatarKey(Date.now());
      } catch (err: any) {
        console.error("Failed to fetch dashboard:", err);
        console.error("Error details:", err.message);
        if (err.message.includes("Not Found") || err.message.includes("404")) {
          setError(`User not found. User ID: ${id}. Please make sure you're logged in with a valid account.`);
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

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'avatar_url' && dashboardData) {
        setDashboardData({
          ...dashboardData,
          user: {
            ...dashboardData.user,
            avatar: e.newValue || dashboardData.user.avatar
          }
        });
        setAvatarKey(Date.now());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dashboardData]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="dashboard-error">
        <div className="error-card">
          <p className="error-text">{error || "Failed to load dashboard"}</p>
        </div>
      </div>
    );
  }

  const { user, statistics, lastMatch } = dashboardData;

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            <Trophy className="dashboard-title-icon" />
            <span>Player Dashboard</span>
          </h1>
        </div>

        <div className="dashboard-grid">
          {/* User Profile Card */}
          <div className="profile-card card">
            <div className="profile-content">
              <div className="avatar" key={avatarKey}>
                <img src={avatarSrc} alt={user.User_name} className="avatar-image" />
              </div>
              <div>
                <h2 className="profile-name">{user.User_name || "Player"}</h2>
                <p className="profile-email">{user.email}</p>
              </div>
              <div className="profile-status">
                <div className={`status-dot ${user.isOnline ? 'online' : 'offline'}`}></div>
                <span className="status-text">
                  {user.isOnline ? "Online" : "Offline"}
                </span>
              </div>
              {user.Auto_Match && (
                <span className="auto-match-badge">
                  Auto Match Enabled
                </span>
              )}
            </div>
          </div>

          {/* Statistics Card */}
          <div className="stats-card card">
            <div className="card-content">
              <h3 className="card-title">
                <TrendingUp className="card-icon" />
                <span>Statistics</span>
              </h3>
              <div className="stats-list">
                <div className="stat-item">
                  <span className="stat-label">Total Matches</span>
                  <span className="stat-value">{statistics.totalMatches}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Wins</span>
                  <span className="stat-value wins">{statistics.totalWins}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Losses</span>
                  <span className="stat-value losses">{statistics.totalLosses}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Win Rate</span>
                  <span className="stat-value winrate">{statistics.winRate}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Tournaments</span>
                  <span className="stat-value">{statistics.tournamentParticipations}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Last Match Card */}
          <div className="match-card card">
            <div className="card-content">
              <h3 className="card-title">
                <Gamepad2 className="card-icon" />
                <span>Last Match</span>
              </h3>
              {lastMatch ? (
                <div className="match-details">
                  <div className="match-status">
                    Status: <span className={`status-badge ${lastMatch.gameStatus === 'FINISHED' ? 'finished' : 'pending'}`}>
                      {lastMatch.gameStatus}
                    </span>
                  </div>
                  <div className="match-scores">
                    <div className="score-item">
                      <span className="player-name">{lastMatch.player1Name || "Player 1"}</span>
                      <span className="player-score">{lastMatch.score1 || 0}</span>
                    </div>
                    <div className="score-item">
                      <span className="player-name">{lastMatch.player2Name || "Player 2"}</span>
                      <span className="player-score">{lastMatch.score2 || 0}</span>
                    </div>
                  </div>
                  {lastMatch.Winner_Id && (
                    <div className="match-winner">
                      <div className="winner-info">
                        <Award className="winner-icon" />
                        <span className="winner-label">Winner: </span>
                        <span className="winner-name">
                          {lastMatch.Winner_Id === lastMatch.P1_Id ? lastMatch.player1Name : 
                           lastMatch.Winner_Id === lastMatch.P2_Id ? lastMatch.player2Name : 
                           "Unknown"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="no-match">No matches played yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="info-section">
          <div className="info-card card">
            <div className="info-grid">
              <div>
                <h3 className="info-title">
                  <User className="info-icon" />
                  <span>Account Information</span>
                </h3>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-label">Member since:</span>
                    <span className="info-value">{new Date(user.CreatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">User ID:</span>
                    <span className="info-value user-id">{user.id}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="info-title">
                  <Users className="info-icon" />
                  <span>Performance</span>
                </h3>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-label">Total Games:</span>
                    <span className="info-value-bold">{statistics.totalMatches}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Win Percentage:</span>
                    <span className="info-value-bold primary">{statistics.winRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
