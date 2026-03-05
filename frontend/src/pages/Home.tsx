import { useNavigate } from "react-router-dom";
import { useEffect,useState,useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Gamepad2, Zap } from "lucide-react";
import { toast } from "sonner";
import { decodeJWT } from "@/lib/jwt-utils";
const Home = () => {

  const navigate = useNavigate();
  let  id =null;
  let token = localStorage.getItem("token");

  if (token)
  {
    const decoded = decodeJWT(token);
    id = decoded.id;
  }
  
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    action: null | (() => Promise<void>);
  }>({
    open: false,
    action: null
  });

  const checkhandel = async (mode: number) => {
    return await fetch(`http://${import.meta.env.VITE_DOMAIN}:3000/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: localStorage.getItem("token"), mode }),
      credentials: "include"
    });
  };

  const endmatchhandel = async () => {
    return await fetch(`http://${import.meta.env.VITE_DOMAIN}:3000/endmatch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: localStorage.getItem("token") }),
      credentials: "include"
    });
  };

  const features = [
    {
      icon: Trophy,
      title: "Local Tournament",
      type:"page",
      description: "4-player offline bracket on one device",
      page: "/local-tournament",
    },
    {
      // entry point into the new websocket-backed online tournament lobby
      icon: Trophy,
      title: "Online Tournament",
      type:"page",
      description: "Join live brackets with other players",
      page: "/tournament-online",
    },
    {
      icon: Users,
      title: "1 vs 1",
      type:"page",
      mode:0,
      description: "Play with a friend on the same keyboard",
      page: "/game"
    },
    {
      icon: Gamepad2,
      title: "1 vs 1 Online",
      type:"onlinegame",
      mode:2,
      description: "Play with players online",
      page: "/loading?mode=2",
    },
    {
      icon: Gamepad2,
      title: "2 vs 2 Online",
      type:"onlinegame",
      mode:4,
      description: "Team up and play against another team",
      page: "/loading?mode=4",
    },
    {
      icon: Zap,
      title: "1 vs AI",
      type:"page",
      mode:0,
      description: "Outsmart this AI",
      page: "/game-ai",
    }
  ];

  const handleFeatureClick = async (feature: any) => {

    if (feature.type !== "onlinegame") {
      navigate(feature.page);
      return;
    }

    let res = await checkhandel(feature.mode);

    if (res.status === 403) {
      navigate(feature.page);
      return;
    }

    if (!res.ok) {
      setConfirmState({
        open: true,
        action: async () => {
          await endmatchhandel();
          navigate(feature.page);
        }
      });
    } else {
      navigate(feature.page);
    }
  };

  return (
    <div className="page-container">
      <section className="hero-section">
        <div className="hero-glow-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title animate-float">
            PONG <span className="hero-title-accent">ARENA</span>
          </h1>
          <p className="hero-subtitle">
            The ultimate retro gaming tournament experience.
            Compete, dominate, and become the Pong champion!
          </p>
          <button
            onClick={() => navigate("/local-tournament")}
            className="hero-button animate-pulse-glow"
          >
            <Trophy className="button-icon" />
            Start Local Tournament
          </button>
        </div>
      </section>
      <section className="features-section">
        <div className="features-container">
          <h2 className="features-title glow-text">
            Game modes
          </h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="feature-card"
                onClick={() => handleFeatureClick(feature)}
              >
                <div className="feature-card-content">
                  <div className="feature-icon-container">
                    <feature.icon className="feature-icon" />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {confirmState.open && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h2>Ongoing Match</h2>
            <p>You already have an ongoing match.</p>
            <p>If you continue, you will lose it.</p>
            <div className="confirm-actions">
              <button
                className="confirm-cancel"
                onClick={() => setConfirmState({ open: false, action: null })}
              >
                Cancel
              </button>
              <button
                className="confirm-continue"
                onClick={async () => {
                  await confirmState.action?.();
                  setConfirmState({ open: false, action: null });
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;