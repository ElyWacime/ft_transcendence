import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {  Mail, Lock, Camera, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { handleStartConversation } from "./Chat";
import "../css/profile.css";
import { useChatSocket } from "@/context/ChatSocketContext";
import { useAuth } from "@/context/AuthContext";
import { fetchWithAuth } from "@/lib/tokenRefresh";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({
    id: "",
    email: "",
    User_name: "",
    avatar: "",
    Auto_Match: null as boolean | null,
    CreatedAt: null as string | null,
    isOnline: false
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
  const { user, accessToken, updateAccessToken } = useAuth();

    
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = user?.id;
        
        if (userId) {
          const authRes = await fetchWithAuth(`/api/users/user-info/${userId}`, { method: "GET" }, accessToken, updateAccessToken);
          
          if (!authRes.ok) {
            throw new Error("Failed to fetch user info");
          }
          
          const authData = await authRes.json();
          
          setUserInfo({
            id: authData.id || "",
            email: authData.email || "",
            User_name: authData.name || "Player",
            avatar: authData.avatar || "",
            Auto_Match: authData.Auto_Match ?? null,
            CreatedAt: authData.CreatedAt ?? null,
            isOnline: authData.loggedIn || false
          });
          setAvatarKey(Date.now());
        } else {
          setUserInfo({
            id: "",
            email: user?.email || "",
            User_name: user?.name || "Player",
            avatar: "",
            Auto_Match: null,
            CreatedAt: null,
            isOnline: false
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:");
        setUserInfo({
          id: "",
          email: user?.email || "",
          User_name: user?.name || "Player",
          avatar: "",
          Auto_Match: null,
          CreatedAt: null,
          isOnline: false
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [location.pathname, user?.id, user?.email, user?.name]);

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
      const { fetchWithAuth } = await import("@/lib/tokenRefresh");

      const searchRes = await fetchWithAuth(`/api/users/search-this-name`, {
        method: "POST",
        body: JSON.stringify({ name: trimmed }),
      }, accessToken, updateAccessToken);

      if (!searchRes.ok) {
        throw new Error(`Username "${trimmed}" not found. Please check the spelling.`);
      }

      const searchData = await searchRes.json();
      const userId = searchData.user_id;

      const infoRes = await fetchWithAuth(`/api/users/user-info/${userId}`, {
        method: "GET",
      }, accessToken, updateAccessToken);

      if (!infoRes.ok) {
        throw new Error("Failed to fetch user info");
      }

      const infoData = await infoRes.json();

      setSearchResult({
        user: {
          id: infoData.id || "",
          User_name: infoData.name || "Player",
          email: infoData.email || "",
          avatar: infoData.avatar || "",
        },
        statistics: null,
        lastMatch: null,
      });
      setSearchError(null);
      toast.success("User found");
    } catch (err: any) {
      setSearchResult(null);
      setSearchError( "User not found");
      toast.error("User not found");
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
    },
    {
      title: "Change username",
      description: "Update your username",
      icon: User,
      color: "text-green-500",
      path: "/profile/change-username"
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
                  {userInfo.User_name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="profile-user-info">
                <h2 className="profile-user-name">{userInfo.User_name}</h2>
                <p className="profile-user-email">{userInfo.email}</p>
                <button
                  variant="outline"
                  onClick={() => navigate("/dashboard",{state : { id: userInfo.User_name }})}
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
                      <button className="profile-dashboard-btn dashboard-btn" onClick={() => {navigate(`/dashboard/${searchResult.user.User_name}`)}}>
                        View dashboard
                      </button>
                      {String(user?.id) !== String(searchResult.user.id) && (
                        <button type="button" className="profile-dashboard-btn dashboard-btn" onClick={async () => {
                          const conversationId =  await handleStartConversation({ userId: searchResult.user.id, socket: socket, accessToken, updateAccessToken })
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