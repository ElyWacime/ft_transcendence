import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Gamepad2, Zap } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Trophy,
      title: "Tournament Mode",
      description: "Compete in elimination tournaments with dynamic brackets",
      page: "/tournament",
    },
    {
      icon: Users,
      title: "1 vs 1",
      description: "Play with a friend on the same keyboard",
      page: "/game"
    },
    {
      icon: Gamepad2,
      title: "1 vs 1 Online",
      description: "Play with players online",
      page: "/loading?mode=2",
    },
    {
      icon: Gamepad2,
      title: "2 vs 2 Online",
      description: "Team up and play against another team",
      page: "/loading?mode=4",
    },
    {
      icon: Zap,
      title: "1 vs AI",
      description: "Outsmart this AI ",
      page: "/game-ai",
    }
  ];
  return (
    <div className="page-container">
      <section className="hero-section">
        <div className="hero-glow-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title animate-float">
            PONG
            <span className="hero-title-accent"> ARENA</span>
          </h1>
          <p className="hero-subtitle">
            The ultimate retro gaming tournament experience.
            Compete, dominate, and become the Pong champion!
          </p>
          <Button
            size="lg"
            onClick={() => { navigate("/tournament") }}
            className="hero-button animate-pulse-glow"
          >
            <Trophy className="button-icon" />
            START TOURNAMENT
          </Button>
        </div>
      </section>
      <section className="features-section">
        <div className="features-container">
          <h2 className="features-title glow-text">
            Game Features
          </h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <Card 
                onClick={() => { navigate(feature.page) }}
                key={index}
                className="feature-card"
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
    </div>
  );
};

export default Home;
