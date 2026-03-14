import { useLocation, useNavigate } from "react-router-dom";
import {useCallback,useEffect} from "react";

const Result = () => { 
    const navigate = useNavigate();
    const location = useLocation();
    const stat = location.state ;
    
    useEffect(() => {
      if (!stat) {
        navigate("/");
      }
    }, [stat, navigate]);
    
    if (!stat) {
      return <div>Redirecting...</div>; 
    }
    
    let {message,mode} = stat;
    const resetGame = useCallback(() => {navigate(`/loading?mode=${mode}`)}, []);
    return (<>
        <div className="ai-game-page">
        <div className="ai-game-container">
        <div className="ai-game-header">
          <div className="ai-game-title-container">
            <h1 className="ai-game-title glow-text">
              <span>Match Result</span>
            </h1>
            <p className="ai-game-subtitle">
            Challenge Other Players.
            </p>
          </div>
        </div>
            <div className="tournament-match">
              <div className="game-header">
                <div style={{ paddingTop: "2rem" }} className="ai-game-title-container">
                <div className="additional-controls">
              <button onClick={resetGame} className="game-control-button2">
                Play Another Match!
              </button>
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
                 {message} 
              </div>
            </div>
        </div>
    </div>
    </>);
};

export default Result;