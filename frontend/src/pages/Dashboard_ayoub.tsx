import { useState, useEffect } from "react";
import { useNavigate, useParams,useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { playerDashboardApi_ayoub } from "@/lib/api_ayoub";
import { User, TrendingUp, Gamepad2, Award, Users, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import "../css/dashboard.css";

interface DashboardData {
  user: {
    id: string;
    email: string;
    User_name: string;
    avatar: string;
    isOnline: boolean;
    CreatedAt: string;
  };
  statistics: {
    totalMatches: number;
    totalWins: number;
    totalLosses: number;
    winRate: number;
    totalTournaments?: number;
    totalTourWins?: number;
  };
  lastMatch: any | null;
}

const Dashboard_ayoub = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as { id?: string }) || {};
  const { id } = state;
  const { identifier } = useParams<{ identifier?: string }>();
  const { isLoggedIn, user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const { accessToken, updateAccessToken } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL || 'https://localhost';

  const avatarSrc = dashboardData?.user.avatar?.startsWith("data:image") ? dashboardData?.user.avatar : `${dashboardData?.user.avatar || "https://scx2.b-cdn.net/gfx/news/2019/galaxy.jpg"}?t=${avatarKey}`;

  useEffect(() => {
    if (!identifier && !isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      let userIdentifier = id || identifier;

      if (!userIdentifier) {
        userIdentifier = authUser?.name || undefined;
        if (!userIdentifier) {
          setError("Unable to get username. Please provide a username in the URL or log in.");
          setLoading(false);
          return;
        }
      }

      try {
        const data = await playerDashboardApi_ayoub.getCompleteUserData(userIdentifier, accessToken, updateAccessToken);
        setDashboardData(data);
        setAvatarKey(Date.now());
      } catch (err: any) {
        if (err.message.includes("not found")) {
          setError(`Username "${userIdentifier}" not found. Please check the spelling.`);
        } else {
          setError( "Failed to load dashboard data");
        }
        toast.error( "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [id, identifier, isLoggedIn, navigate, authUser?.name]);

  useEffect(() => {
    const handleAvatarUpdate = () => {
      const userIdentifier = id || identifier || authUser?.name;
      if (userIdentifier && !loading) {
        playerDashboardApi_ayoub.getCompleteUserData(userIdentifier, accessToken, updateAccessToken)
          .then((data) => {
            setDashboardData(data);
            setAvatarKey(Date.now());
          })
          .catch(() => {
          });
      }
    };

    window.addEventListener("avatarUpdated", handleAvatarUpdate);
    return () => window.removeEventListener("avatarUpdated", handleAvatarUpdate);
  }, [id, identifier, loading, authUser?.name]);

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
        <div className="dashboard-header">
          <h1 className="dashboard-title glow-text">
            <span>Player Dashboard</span>
          </h1>
        </div>

        <div className="dashboard-grid">
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

          <Card className="dashboard-card">
            <div className="stat-section">
              <h3 className="section-title">
                <TrendingUp className="stat-icon" />
                <span>Statistics</span>
              </h3>
              <div className="dashboard-stats">
                <div className="stat-row" style={{ cursor: "pointer" }} onClick={() => { navigate("/history", { state: { id: user.id } }); }}>
                  <span className="stat-label">Match History</span>
                  <ExternalLink className="stat-icon" style={{ width: "1rem", height: "1rem" }} />
                </div>
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
                <div className="stat-row">
                  <span className="stat-label">Tournaments Played</span>
                  <span className="stat-value">{statistics.totalTournaments ?? 0}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Tournament Wins</span>
                  <span className="stat-value stat-value-success">{statistics.totalTourWins ?? 0}</span>
                </div>
              </div>
            </div>
          </Card>

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
                      <span className={`badge-status ${lastMatch.gameStatus === "FINISHED" ? "finished" : "pending"}`}>
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
                        <span className="stat-value">{lastMatch.score2 || 0}</span>
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