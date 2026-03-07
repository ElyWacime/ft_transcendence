import { useNavigate } from "react-router-dom";
import { useEffect, useState,useRef } from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Gamepad2, Zap } from "lucide-react";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/tokenRefresh";

interface CurrentUser {
  id: string;
  name: string;
}

const Home = () => {
  const navigate = useNavigate();
  
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    action: null | (() => Promise<void>);
  }>({
    open: false,
    action: null,
  });

  let userdata = useRef<CurrentUser>();
  const API_DOMAIN = `https://${import.meta.env.VITE_DOMAIN}`;
  const GAME_SERVICE_URL = import.meta.env.VITE_GAME_SERVICE_URL || `https://${import.meta.env.VITE_DOMAIN}`
  // fetch current user from server using HttpOnly cookie
  useEffect(() => {
    const fetchMe = async () => {
      try {
        await fetchWithAuth(`${GAME_SERVICE_URL}/api/user/refresh`, {
          method: "GET",
          credentials: "include", // sends HttpOnly cookie automatically
        });
 
        const res = await fetch(`${GAME_SERVICE_URL}/api/game/me`, {
          method: "GET",
          credentials: "include", // sends HttpOnly cookie automatically
        });
        if (res.ok) {
          let data = await res.json();
          userdata = data.message;
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchMe();
  }, []);

  const checkhandel = async (mode: number) => {
    return await fetch(`${API_DOMAIN}/api/game/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // cookie auth
      body: JSON.stringify({ mode }),
    });
  };

  const endmatchhandel = async () => {
    return await fetch(`${API_DOMAIN}/api/game/endmatch`, {
      method: "POST",
      credentials: "include",
    });
  };

  const features = [
    {
      icon: Gamepad2,
      title: "1 vs 1 Online",
      type: "onlinegame",
      mode: 2,
      description: "Play with players online",
      page: "/loading?mode=2",
    },
    {
      icon: Gamepad2,
      title: "2 vs 2 Online",
      type: "onlinegame",
      mode: 4,
      description: "Team up and play against another team",
      page: "/loading?mode=4",
    },
    {
      icon: Users,
      title: "1 vs 1",
      type: "page",
      mode: 0,
      description: "Play with a friend on the same keyboard",
      page: "/game",
    },
    {
      icon: Zap,
      title: "1 vs AI",
      type: "page",
      mode: 0,
      description: "Outsmart this AI",
      page: "/game-ai",
    },
  ];

  const handleFeatureClick = async (feature: any) => {
    if (feature.type !== "onlinegame") {
      navigate(feature.page);
      return;
    }
    console.log("userdata >>>" ,userdata, userdata.id);
    if (userdata && userdata.id)
    {
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
            },
          });
        } else {
          navigate(feature.page);
        }
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
            The ultimate retro gaming tournament experience. Compete, dominate, and become the Pong champion!
          </p>
          <button
            onClick={() => navigate("/online-tournament")}
            className="hero-button animate-pulse-glow"
          >
            <Trophy className="button-icon" />
            Start Tournament
          </button>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <h2 className="features-title glow-text">Game modes</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <Card key={index} className="feature-card" onClick={() => handleFeatureClick(feature)}>
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