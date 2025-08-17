import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Trophy, Gamepad2, MessageSquare } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/tournament", label: "Tournament", icon: Trophy },
  { path: "/game", label: "Game", icon: Gamepad2 },
];

export const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-game text-xl font-bold glow-text">PONG ARENA</span>
          </div>
          
          <div className="flex items-center space-x-6">
            {navItems.map((item) => (
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
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
