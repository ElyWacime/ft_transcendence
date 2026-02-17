import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState ,useRef, useCallback} from "react";
import { useWebSocket } from "@/context/WebSocketContext";

const MatchMacking = () => {
    const { ws, isReady } = useWebSocket();
    let keys = { ArrowUp: false, ArrowDown: false };
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get("mode");
    const email = localStorage.getItem("email");
    let del = useRef(true);
    let matchref = useRef(true);
    const [features, setFeatures] = useState([]);

    const handleMessage = useCallback((event: MessageEvent) => {
      const data = JSON.parse(event.data);
      matchref.current = data.id;
      setFeatures(() => {
          if (mode == "4")
          {
            return [
                {
                    icon: Users,
                    title: data.player1Name || "Player1",
                    description: data.player1Name != null ? "ready"  : "waiting" ,
                    color: "feature-icon-container-color-red"
                },
                {
                    icon: Users,
                    title: data.player2Name || "Player2",
                    description:data.player2Name != null ? "ready"  : "waiting" ,
                    color: "feature-icon-container"
                },
                {
                    icon: Users,
                    title: data.player3Name || "Player3",
                    description: data.player3Name != null ? "ready"  : "waiting" ,
                    color: "feature-icon-container-color-red"
                },
                {
                    icon: Users,
                    title: data.player4Name || "Player4",
                    description: data.player4Name != null ? "ready"  : "waiting" ,
                    color: "feature-icon-container"
                },
            ];
          }
          else
          {
            return [
              {
                  icon: Users,
                  title: data.player1Name || "Player1",
                  description:  data.player1Name != null ? "ready"  : "waiting" ,
                  color: "feature-icon-container"
              },
              {
                  icon: Users,
                  title: data.player2Name || "Player2",
                  description:  data.player2Name != null ? "ready"  : "waiting" ,
                  color: "feature-icon-container"
              }];
          }
      });
      if (data.count_players == mode) 
      {
        del.current = false;
          navigate("/game-online", {
              state: {
                  player1Name: data.player1Name,
                  player2Name: data.player2Name,
                  player3Name: data.player3Name,
                  player4Name: data.player4Name,
                  mode
              },
          });
      }
    });

    useEffect(() => {
      if (!ws || !isReady || ws.readyState != WebSocket.OPEN) return;

      ws.send(JSON.stringify({
            token:localStorage.getItem("token"),
            type: "REGISTER",
            mode,
        }));
        ws.addEventListener("message", handleMessage);
        return () => {
            if (del.current && ws && isReady && ws.readyState == WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    token:localStorage.getItem("token"),
                    type: "DELETE",
                    matchId: matchref.current 
                }));
            }
            ws.removeEventListener("message", handleMessage);
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
                        <div className={feature.color}>
                          <feature.icon className="feature-icon"  />
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
