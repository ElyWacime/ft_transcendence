import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Trophy, Mail, Lock, Camera, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import "../css/profile.css";
import { useChatSocket } from "@/context/ChatSocketContext";
import { handleStartConversation } from "./Chat";



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
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({
    email: "",
    username: "",
    avatar: ""
  });
  const [searchName, setSearchName] = useState("");
  const [searchResult, setSearchResult] = useState<{
    user: {
      id: string;
      User_name: string;
      email: string;
      avatar?: string;
    };
    statistics?: any;
    lastMatch?: any;
  } | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const { socket } = useChatSocket();
    
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
          // Always get email from localStorage first (most up-to-date after email change)
          const email = localStorage.getItem("email") || tokenData?.email || "";
          const username = localStorage.getItem("username") || tokenData?.username || "Player";
          setUserInfo({ email, username, avatar: "" });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        const tokenData = getUserInfoFromToken();
        // Always get email from localStorage first (most up-to-date after email change)
        const email = localStorage.getItem("email") || tokenData?.email || "";
        const username = localStorage.getItem("username") || tokenData?.username || "Player";
        setUserInfo({ email, username, avatar: "" });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [location.pathname]); // Re-fetch when route changes

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = searchName.trim();
    setSearchLoading(true);
    setSearchError(null);
    if (!trimmed) {
      setSearchError("Enter a username to search");
      setSearchResult(null);
      setSearchLoading(false);
      return;
    }

    try {
      const data = await userApi.searchByName(trimmed);
      setSearchResult(data);
      setSearchError(null);
      toast.success("User found");
    } catch (err: any) {
      setSearchResult(null);
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
            <span>Profile Settings</span>
          </h1>
          <p className="profile-subtitle">Manage your account settings</p>
        </div>

  <div className="profile-content">
          {} 
          <Card className="profile-card">
            <div className="profile-user-card">
              <Avatar key={avatarKey} className="profile-avatar">
                <AvatarImage src={userInfo.avatar || "https://scx2.b-cdn.net/gfx/news/2019/galaxy.jpg"} />
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
                  className="profile-dashboard-btn dashboard-btn"
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
                <button type="submit" disabled={searchLoading} className="search-btn">
                  {searchLoading ? "Searching..." : "Search"}
                </button>
              </form>
              {searchError && (
                <p className="profile-error-text">{searchError}</p>
              )}
              {searchResult && (
                <div className="profile-search-result">
                  <div className="profile-result-content">
                    <Avatar className="profile-result-avatar">
                      <AvatarImage src={searchResult.user.avatar || "https://scx2.b-cdn.net/gfx/news/2019/galaxy.jpg"} />
                      <AvatarFallback>
                        {searchResult.user.User_name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="profile-result-user">
                      <p className="profile-result-name">{searchResult.user.User_name}</p>
                      <p className="profile-result-email">{searchResult.user.email}</p>
                    </div>
                    <div className="profile-result-actions">
                      <button className="profile-dashboard-btn dashboard-btn" onClick={() => {navigate(`/dashboard/${searchResult.user.User_name}`, {state : {id : searchResult.user.id}})}}>
                        View dashboard
                      </button>
                      {String(getUserInfoFromToken()?.id) !== String(searchResult.user.id) && (
                        <button type="button" className="profile-dashboard-btn dashboard-btn" onClick={async () => {
                          const conversationId =  await handleStartConversation({ userId: searchResult.user.id, socket: socket })
                          navigate(`/chat/${conversationId}`)
                        }}>Message
                        </button>
                      )}
                    </div>
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