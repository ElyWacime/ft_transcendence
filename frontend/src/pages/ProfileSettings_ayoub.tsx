import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Mail, Lock, Camera, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { userApi } from "@/lib/api";

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

  useEffect(() => {
    const tokenData = getUserInfoFromToken();
    const email = localStorage.getItem("email") || tokenData?.email || "";
    const username = localStorage.getItem("username") || tokenData?.username || "Player";
    const avatar = localStorage.getItem("avatar_url") || "";
    
    setUserInfo({ email, username, avatar });
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

  return (
    <div className="min-h-screen pt-16 bg-gradient-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-6xl font-game font-bold glow-text flex items-center justify-center space-x-3">
            <Trophy className="w-8 h-8 text-primary" />
            <span>Profile Settings</span>
          </h1>
          <p className="text-muted-foreground mt-2">Manage your account settings</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* User Profile Card */}
          <Card className="p-8 bg-background/60 backdrop-blur-sm border border-border">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-32 h-32 border-4 border-primary/20">
                <AvatarImage src={userInfo.avatar || "https://www.gravatar.com/avatar/"} />
                <AvatarFallback className="text-4xl">
                  {userInfo.username?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2">{userInfo.username}</h2>
                <p className="text-muted-foreground mb-4">{userInfo.email}</p>
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="mt-2"
                >
                  <User className="w-4 h-4 mr-2" />
                  View Dashboard
                </Button>
              </div>
            </div>
          </Card>

          {/* Search other players */}
          <Card className="p-6 bg-background/60 backdrop-blur-sm border border-border">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <span>Find a player</span>
                </h3>
              </div>
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
                <Input
                  placeholder="Enter player name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  disabled={searchLoading}
                  className="bg-muted/20 border border-border text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button type="submit" disabled={searchLoading}>
                  {searchLoading ? "Searching..." : "Search"}
                </Button>
              </form>
              {searchError && (
                <p className="text-sm text-destructive">{searchError}</p>
              )}
              {searchResult && (
                <div className="border border-border rounded-lg p-4 bg-background/40">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Username</p>
                      <p className="text-lg font-semibold">{searchResult.user_name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{searchResult.user_email}</p>
                      <p className="text-xs text-muted-foreground mt-1">ID: {searchResult.user_id}</p>
                    </div>
                    <Button onClick={() => navigate(`/dashboard/${searchResult.user_id}`)}>
                      View dashboard
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Settings Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {settingsOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Card
                  key={option.path}
                  className="p-6 bg-background/60 backdrop-blur-sm border border-border hover:border-primary/50 transition-all cursor-pointer group"
                  onClick={() => navigate(option.path)}
                >
                  <div className="text-center space-y-3">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComponent className={`w-8 h-8 ${option.color}`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold">{option.title}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                    <Button variant="ghost" className="w-full mt-2">
                      Update →
                    </Button>
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