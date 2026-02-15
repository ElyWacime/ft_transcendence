import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Trophy, Mail, Lock, Camera, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import "../css/profile.css";

function getUserInfoFromToken() {
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
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    email: "",
    username: "",
    avatar: ""
  });
  const [searchName, setSearchName] = useState("");
  const [searchResult, setSearchResult] = useState<{
    user_id: string;
    user_name: string;
    user_email: string;
  } | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatarKey, setAvatarKey] = useState(Date.now());

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const tokenData = getUserInfoFromToken();
        const userId = tokenData?.id;
        
        if (userId) {
          const data = await userApi.getUserById(userId);

          setUserInfo({
            email: data.email || data.user_email || "",
            username: data.User_name || data.user_name || "Player",
            avatar: data.avatar || ""
          });
          setAvatarKey(Date.now());
        } else {
          const email = localStorage.getItem("email") || tokenData?.email || "";
          const username = localStorage.getItem("username") || tokenData?.username || "Player";
          setUserInfo({ email, username, avatar: "" });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        const tokenData = getUserInfoFromToken();
        const email = localStorage.getItem("email") || tokenData?.email || "";
        const username = localStorage.getItem("username") || tokenData?.username || "Player";
        setUserInfo({ email, username, avatar: "" });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchLoading(true);
    setSearchError(null);
    setSearchResult(null);

    const trimmed = searchName.trim();
    if (!trimmed) {
      setSearchError("Enter a username to search");
      setSearchLoading(false);
      return;
    }

    try {
      const data = await userApi.searchByName(trimmed);
      setSearchResult(data);
      toast.success("User found");
    } catch (err: any) {
      setSearchError(err?.message || "User not found");
      toast.error(err?.message || "User not found");
    } finally {
      setSearchLoading(false);
    }
  };

  const settingsOptions = [
    {
      title: "Change Email",
      description: "Update your email address",
      icon: Mail,
      color: "text-blue-500",
      path: "/profile/change-email"
    },
    {
      title: "Change Password",
      description: "Update your password",
      icon: Lock,
      color: "text-green-500",
      path: "/profile/change-password"
    },
    {
      title: "Change Profile Picture",
      description: "Update your avatar",
      icon: Camera,
      color: "text-purple-500",
      path: "/profile/change-picture"
    }
  ];

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title glow-text">
            <Trophy className="profile-title-icon" />
            <span>Profile Settings</span>
          </h1>
          <p className="profile-subtitle">Manage your account settings</p>
        </div>

  <div className="profile-content">
          {} 
          <Card className="profile-card">
            <div className="profile-user-card">
              <Avatar key={avatarKey} className="profile-avatar">
                <AvatarImage src={userInfo.avatar || "https://www.gravatar.com/avatar/"} />
                <AvatarFallback className="profile-avatar-fallback">
                  {userInfo.username?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="profile-user-info">
                <h2 className="profile-user-name">{userInfo.username}</h2>
                <p className="profile-user-email">{userInfo.email}</p>
                <button
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="profile-dashboard-btn"
                >
                  <User className="profile-dashboard-icon" />
                  View Dashboard
                </button>
              </div>
            </div>
          </Card>
          <Card className="profile-card profile-search-card">
            <div className="profile-search-section">
              <div className="profile-search-header">
                <h3 className="profile-search-title">
                  <User className="profile-search-icon" />
                  <span>Find a player</span>
                </h3>
              </div>
              <form onSubmit={handleSearch} className="profile-search-form">
                <input 
                  placeholder="Enter player name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  disabled={searchLoading}
                  className="profile-search-input"
                    >
                </input>
                <button type="submit" disabled={searchLoading}>
                  {searchLoading ? "Searching..." : "Search"}
                </button>
              </form>
              {searchError && (
                <p className="profile-error-text">{searchError}</p>
              )}
              {searchResult && (
                <div className="profile-search-result">
                  <div className="profile-result-content">
                    <div>
                      <p className="profile-result-label">Username</p>
                      <p className="profile-result-name">{searchResult.user_name}</p>
                      <p className="profile-result-email">{searchResult.user_email}</p>
                    </div>
                    <button onClick={() => navigate(`/dashboard/${searchResult.user_name}`)}>
                      View dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {}
          <div className="profile-settings-grid">
            {settingsOptions.map((option) => {
              const IconComponent = option.icon;
                          const iconColorClass = option.color === 'text-blue-500' ? 'icon-blue' : 
                                                  option.color === 'text-green-500' ? 'icon-green' : 'icon-purple';
              return (
                <Card
                  key={option.path}
                  className="profile-card profile-option-card"
                  onClick={() => navigate(option.path)}
                >
                  <div className="profile-option-content">
                    <div className="profile-option-icon-wrapper">
                      <div className="profile-option-icon-bg">
                        <IconComponent className={`profile-option-icon ${iconColorClass}`} />
                      </div>
                    </div>
                    <h3 className="profile-option-title">{option.title}</h3>
                    <p className="profile-option-description">{option.description}</p>
                    <button variant="outline" className="profile-option-button">
                      Update →
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;