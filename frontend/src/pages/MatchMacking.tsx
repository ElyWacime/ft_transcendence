import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useWebSocket } from "../hooks/useWebSocket";
import { useEffect, useState } from "react";

const MatchMacking = () => {
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsHost = import.meta.env.VITE_DOMAIN || window.location.hostname;
    const { ws, isReady } = useWebSocket(`${wsProtocol}://${wsHost}/ws`);
    let keys = { ArrowUp: false, ArrowDown: false };
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get("mode");
    const email = localStorage.getItem("email");
    const [features, setFeatures] = useState(() => {
        return [
            {
                icon: Users,
                title: "Player 1",
                description: mode === "4" ? "Team A" : "Player 1",
            },
            {
                icon: Users,
                title: "Player 2",
                description: mode === "4" ? "Team B" : "Player 2",
            },
            ...(mode === "4"
                ? [
                    {
                        icon: Users,
                        title: "Player 3",
                        description: "Team A",
                    },
                    {
                        icon: Users,
                        title: "Player 4",
                        description: "Team B",
                    },
                ]
                : []),
        ];
    });
    useEffect(() => {
      if (!ws || !isReady || ws.readyState != WebSocket.OPEN) return;
      
      ws.send(JSON.stringify({
            token:localStorage.getItem("token"),
            type: "REGISTER",
            email,
            tournement: false,
            keys,
            mode,
            id: email,
        }));

        const handleMessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            setFeatures(() => {
                return [
                    {
                        icon: Users,
                        title: data.player1Name || "Player1",
                        description: mode === "4" ? "Team A" : "Player 1",
                    },
                    {
                        icon: Users,
                        title: data.player2Name || "Player2",
                        description: mode === "4" ? "Team B" : "Player 2",
                    },
                    ...(mode === "4"
                        ? [
                            {
                                icon: Users,
                                title: data.player3Name || "Player3",
                                description: "Team A",
                            },
                            {
                                icon: Users,
                                title: data.player4Name || "Player4",
                                description: "Team B",
                            },
                        ]
                        : []),
                ];
            });
            if (data.count_players == mode) {
                navigate("/game-online", {
                    state: {
                        player1Name: data.player1Name,
                        player2Name: data.player2Name,
                        player3Name: data.player3Name,
                        player4Name: data.player4Name,
                        mode,
                    },
                });
            }
        };
        ws.addEventListener("message", handleMessage);
        return () => {
            if (ws && isReady && ws.readyState == WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    token:localStorage.getItem("token"),
                    type: "DELETE",
                    email,
                    tournement: false,
                    keys,
                    mode,
                    id: email,
                }));
            }
            ws.removeEventListener("message", handleMessage);
            ws.close();
        };
    }, [ws, isReady]);
    return (
        <>
          <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
              <div className="hero-glow-overlay"></div>
              <div className="hero-content">
                <h1 className="hero-title glow-text animate-float">
                  PONG
                  <span className="text-primary"> ARENA</span>
                </h1>
                <p className="hero-subtitle">
                  Play against players online!
                </p>
              </div>
            </section>

            <section className="features-section">
              <div className="features-container">
                <h2 className="features-title glow-text">
                  Game's Waiting Room
                </h2>
                <div className="features-grid">
                  {features.map((feature, index) => (
                    <Card
                      key={index}
                      className="feature-card"
                    >
                      <div className="feature-card-content">
                        <div className="feature-icon-container">
                          <feature.icon className="feature-icon" />
                        </div>
                        <h3 className="feature-card-title">{feature.title}</h3>
                        <p className="feature-card-description">{feature.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </>
      );
};

export default MatchMacking;
