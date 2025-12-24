import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Mail, Lock, Camera, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

  useEffect(() => {
    const tokenData = getUserInfoFromToken();
    const email = localStorage.getItem("email") || tokenData?.email || "";
    const username = localStorage.getItem("username") || tokenData?.username || "Player";
    const avatar = localStorage.getItem("avatar_url") || "";
    
    setUserInfo({ email, username, avatar });
  }, []);

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