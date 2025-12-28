
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Trophy, Gamepad2, MessageSquare, LogIn, LogOut, User, Bot, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";

export const Navigation = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [isGamesOpen, setIsGamesOpen] = useState(false);
  const gamesDropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const gamesModes = [
    { path: "/tournament", label: "Tournament", icon: Trophy },
    { path: "/game-ai", label: "VS AI", icon: Bot },
    { path: "/game", label: "Local Game", icon: Gamepad2 },
  ];

  const baseNavItems = [
    { path: "/chat", label: "Chat", icon: MessageSquare },
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gamesDropdownRef.current && !gamesDropdownRef.current.contains(event.target as Node)) {
        setIsGamesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    return (
      <nav className="main-nav">
        <div className="nav-container">
          <div className="nav-content">
            {/* Logo */}
            <button
              className="nav-logo"
              onClick={() => navigate("/")}
              aria-label="Go to Home"
            >
              <div className="logo-icon">
                <Gamepad2 className="logo-icon-svg" />
              </div>
              <span className="logo-text">
                PONG ARENA
              </span>
            </button>
    
            {/* Links */}
            <div className="nav-links">
              {/* Games Dropdown */}
              <div className="nav-dropdown" ref={gamesDropdownRef}>
                <button
                  className="nav-dropdown-button"
                  onClick={() => setIsGamesOpen(!isGamesOpen)}
                  aria-expanded={isGamesOpen}
                >
                  <Gamepad2 className="nav-icon" />
                  <span className="nav-label">Games</span>
                  <ChevronDown className="dropdown-icon" />
                </button>
                {isGamesOpen && (
                  <div className="nav-dropdown-menu">
                    {gamesModes.map((mode) => (
                      <NavLink
                        key={mode.path}
                        to={mode.path}
                        onClick={() => setIsGamesOpen(false)}
                        className={({ isActive }) =>
                          `nav-dropdown-item ${isActive ? 'nav-dropdown-item-active' : ''}`
                        }
                      >
                        <mode.icon className="nav-icon" />
                        <span>{mode.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>

              {/* Other nav items */}
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
                  // Regular NavLink
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

