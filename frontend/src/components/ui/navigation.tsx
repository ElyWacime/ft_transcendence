
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Trophy, Gamepad2, MessageSquare, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const Navigation = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // calls backend + clears token
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  // Regular pages (no Login/Logout yet)
  const baseNavItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/tournament", label: "Tournament", icon: Trophy },
    { path: "/game", label: "Game", icon: Gamepad2 },
    { path: "/gameonline", label: "gameonline", icon: Gamepad2 },

  ];

  // Add either Login or Logout depending on auth state
  const navItems = isLoggedIn
    ? [
      ...baseNavItems,
      {
        path: "#",
        label: "Logout",
        icon: LogOut,
        onClick: handleLogout,
      },
    ]
    : [
      ...baseNavItems,
      {
        path: "/login",
        label: "Login",
        icon: LogIn,
      },
    ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-game text-xl font-bold glow-text">
              PONG ARENA
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            {navItems.map((item) =>
              item.onClick ? (
                // If item has onClick (Logout)
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300",
                    "hover:bg-secondary hover:text-secondary-foreground text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ) : (
                // Regular NavLink (Home, Tournament, Login)
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300",
                      "hover:bg-secondary hover:text-secondary-foreground",
                      isActive
                        ? "bg-primary text-primary-foreground glow-blue"
                        : "text-muted-foreground hover:text-foreground"
                    )
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

