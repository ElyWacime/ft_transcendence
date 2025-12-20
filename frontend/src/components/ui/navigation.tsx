
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Trophy, Gamepad2, MessageSquare, LogIn, LogOut, User ,  Bot} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const Navigation = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const baseNavItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/tournament", label: "Tournament", icon: Trophy },
    { path: "/game-ai", label: "VS AI", icon: Bot },
    { path: "/game", label: "Game", icon: Gamepad2 },
    { path: "/profile", label: "Profile", icon: User},
  ];

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
      <nav className="main-nav">
        <div className="nav-container">
          <div className="nav-content">
            {/* Logo */}
            <div className="nav-logo">
              <div className="logo-icon">
                <Gamepad2 className="logo-icon-svg" />
              </div>
              <span className="logo-text">
                PONG ARENA
              </span>
            </div>
    
            {/* Links */}
            <div className="nav-links">
              {navItems.map((item) =>
                item.onClick ? (
                  // If item has onClick (Logout)
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="nav-button logout-button"
                  >
                    <item.icon className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                  </button>
                ) : (
                  // Regular NavLink (Home, Tournament, Login)
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
                    }
                  >
                    <item.icon className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                  </NavLink>
                )
              )}
            </div>
          </div>
        </div>
      </nav>
    );
};

