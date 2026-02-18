
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import "../css/notfound.css";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (<>
    <div className="ai-game-page">
    <div className="ai-game-container">
    <div className="ai-game-header">
      <div className="ai-game-title-container">
        <h1 className="ai-game-title glow-text">
          <span>Ooops! Page Not Found</span>
        </h1>
        <p className="ai-game-subtitle">
        </p>
      </div>
    </div>
        <div className="tournament-match">
          <div className="game-header">
            <div style={{ paddingTop: "2rem" }} className="ai-game-title-container">
              <h1 className="ai-game-title glow-text">
              </h1>
            <div className="additional-controls">
        </div>
            </div>
            <div className="header-spacer"></div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            fontSize: '4rem',
            fontWeight: 'bold',
            color: '#3b82f6',
            textShadow: '0 0 30px rgba(59, 130, 246, 0.6)',
            fontFamily: 'monospace'
          }}>
                 <a href="/" className="notfound-link">
         Return to Home
          </a>
          </div>
        </div>
    </div>
</div>
</>);
};

export default NotFound;
