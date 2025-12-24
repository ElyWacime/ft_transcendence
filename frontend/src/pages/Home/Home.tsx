import { useNavigate } from "react-router-dom";
import { Trophy, Users, Gamepad2, Zap } from "lucide-react";
import "./Home.css";

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
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            PONG
            <span className="hero-title-accent"> ARENA</span>
          </h1>
          <p className="hero-description">
            The ultimate retro gaming tournament experience.
            Compete, dominate, and become the Pong champion!
          </p>
          <button
            onClick={() => navigate("/tournament")}
            className="hero-button"
          >
            <Trophy className="hero-button-icon" />
            START TOURNAMENT
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="features-title">
            Game Features
          </h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                onClick={() => navigate(feature.page)}
                key={index}
                className="feature-card"
              >
                <div className="feature-card-content">
                  <div className="feature-icon-wrapper">
                    <feature.icon className="feature-icon" />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <div className="quick-actions-container">
          <h2 className="quick-actions-title">Ready to Play?</h2>
          <div className="quick-actions-buttons">
            <button
              onClick={() => navigate("/tournament")}
              className="quick-action-button"
            >
              <Users className="quick-action-icon" />
              Setup Tournament
            </button>
            <button
              onClick={() => navigate("/game")}
              className="quick-action-button"
            >
              <Gamepad2 className="quick-action-icon" />
              Quick Game
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
