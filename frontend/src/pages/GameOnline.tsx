import { useLocation, useNavigate } from "react-router-dom";
import { useEffect ,useCallback, useRef,useState } from "react";
import { useWebSocket } from "@/context/WebSocketContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
interface GameOnlineProps {
  player1Name: string;
  player2Name: string;
  player3Name: string;
  player4Name: string;
  mode: number;
}

const GameOnline = () => {

  const location = useLocation();
  const navigate = useNavigate();
  let state = location.state;
  if(!state)
    state = {};
  const { player1Name, player2Name,player3Name, player4Name, mode } = state;
  const { ws, isReady, wsRef } = useWebSocket();
  const { accessToken, user } = useAuth();
  const id = user?.id || null;
  const canvasRef = useRef(null);
  let isalive = useRef(true);
  const keys = useRef({ ArrowUp: false, ArrowDown: false });
  let matchref = useRef(null);
  const animationRef = useRef(0);

  useEffect(() => {
    if (!state) {
      navigate("/");
    }
  }, [state, navigate]);
  
  const [gameState, setGameState] = useState({
    ball: { x: 400, y: 300, dx: 1, dy: 1, radius: 8 },
    paddle1: { x: 20, y: 250 },
    paddle2: { x: 765, y: 250 },
    paddle3: { x: 60, y: 250 },
    paddle4: { x: 725, y: 250 },
    score: { player1: 0, player2: 0 },
    sizePaddle: { width: 15, height: 100 },
    Mode: mode,
    player1Name:  player1Name,
    player2Name:  player2Name,
    player3Name:  player3Name,
    player4Name:  player4Name,
    P1_Id:  "",
    P2_Id:  "",
    P3_Id:  "",
    P4_Id:  "",
    gameStatus: "STARTING...",
  });

  const draw = useCallback(() => {
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx ||gameState.gameStatus == "STARTING...") return;

  ctx.fillStyle = 'hsl(222 47% 4%)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'hsl(222 47% 12%)';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
  if (gameState.Mode == 4) {
      ctx.fillStyle = "hsl(217 91% 60%)";
      if (gameState.P1_Id == id)
        ctx.fillStyle = 'hsl(0 50% 80%)';
      ctx.fillRect(gameState.paddle1.x, gameState.paddle1.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
      ctx.fillStyle = "hsl(217 91% 60%)";
      if (gameState.P2_Id == id)
          ctx.fillStyle = 'hsl(60 50% 80%)';
      ctx.fillRect(gameState.paddle2.x, gameState.paddle2.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
      ctx.fillStyle = "hsl(217 91% 60%)";
      if (gameState.P3_Id == id)
          ctx.fillStyle = 'hsl(120 50% 80%)';
      ctx.fillRect(gameState.paddle3.x, gameState.paddle3.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
      ctx.fillStyle = "hsl(217 91% 60%)";
      if (gameState.P4_Id == id)
          ctx.fillStyle = 'hsl(300 50% 80%)';
      ctx.fillRect(gameState.paddle4.x, gameState.paddle4.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
  }
  else
  {
    ctx.fillStyle = "hsl(217 91% 60%)";
    ctx.fillRect(gameState.paddle1.x, gameState.paddle1.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
    ctx.fillStyle = "hsl(217 91% 60%)";
    ctx.fillRect(gameState.paddle2.x, gameState.paddle2.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
  }

  ctx.beginPath();
  ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'hsl(217 91% 60%)';
  ctx.fill();

  ctx.shadowColor = 'hsl(217 91% 60%)';
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.shadowBlur = 0; 
 
  }, [gameState]);

  const loop = useCallback(() => {
      draw();
      animationRef.current = requestAnimationFrame(loop);
  }, [draw]);

  const sendMove = useCallback((direction: "up" | "down") => {
    if (!ws || !isReady || ws.readyState !== WebSocket.OPEN) return;
  
    ws.send(JSON.stringify({
      token: accessToken,
      type: "MOVE",
      direction,
      keys: keys.current,
      mode,
      matchId: matchref.current
    }));
  }, [ws, isReady, accessToken]);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      isalive = true;
      if (data)
      {
        if (data.id == -1)
          navigate("/");
        matchref.current = data.id;
        setGameState((prev) => ({
            ...prev,
            ball: {
                x: data.Ball_x,
                y: data.Ball_y,
                dx: data.ball_dx,
                dy: data.ball_dy,
                radius: data.ball_radius
            },
            paddle1: { x: data.Player1_x, y: data.Player1_y },
            paddle2: { x: data.Player2_x, y: data.Player2_y },
            paddle3: { x: data.Player3_x, y: data.Player3_y },
            paddle4: { x: data.Player4_x, y: data.Player4_y },
            score: { player1: data.score1, player2: data.score2 },
            gameStatus: data.gameStatus,
            P1_Id: data.P1_Id,
            P2_Id: data.P2_Id,
            P3_Id: data.P3_Id,
            P4_Id: data.P4_Id,
            Mode:data.mode
        }));
        if (data.score1  >= 5 ||  data.score2  >= 5) {
          console.log("Match ended",data);
          let x = "";
          isalive = false;
          if (data.score1  > data.score2 )
          {
            if (data.P1_Id == id || data.P3_Id == id)
                x = `You win the match!`;
            else
                x = `You Lost the match!`;
          } 
          else
          {
            if (data.P2_Id == id || data.P4_Id == id)
              x = `You win the match!`;
            else
              x = `You Lost the match!`;
          }
          if (!data.T_Id){
            navigate("/result", { 
            state: {  
              message: x, 
              mode: data.mode,
            } 
          });
          }
          else{
            navigate("/online-tournament", {
              state: { 
                tournamentId: data.T_Id, 
              } 
            });
          }
        }
      }
      else
        navigate("/");
  },[]
  );



  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowUp" || e.code === "ArrowDown") e.preventDefault();
      if (e.code === "ArrowUp") keys.current.ArrowUp = true;
      if (e.code === "ArrowDown") keys.current.ArrowDown = true;
      sendMove(e.code === "ArrowUp" ? "up" : "down");
    };
  
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowUp" || e.code === "ArrowDown") e.preventDefault();
      if (e.code === "ArrowUp") keys.current.ArrowUp = false;
      if (e.code === "ArrowDown") keys.current.ArrowDown = false;
      sendMove(e.code === "ArrowUp" ? "up" : "down");
    };
  
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp, { passive: false });
  
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [sendMove]); 

  useEffect(() => {
      animationRef.current = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(animationRef.current);
  }, [loop]);

  useEffect(() => {
    if (!ws || !isReady ||  ws.readyState !== WebSocket.OPEN) return;
    
    ws.addEventListener("message", handleMessage);
      return () => ws.removeEventListener("message", handleMessage);
  }, [ws, isReady]);

  useEffect(() => {
    if (!(ws && isReady && ws.readyState == WebSocket.OPEN)) return;
    ws.send(JSON.stringify({
      token: accessToken,
      type: "ISALIVE",
    }));
  }, [ws, isReady]);
  if (!state) {
    return <div>Redirecting...</div>; 
  }
  return (
    <div className="ai-game-page">
      <div className="ai-game-container">
        <div className="ai-game-header">
          <div className="ai-game-title-container">
            <h1 className="ai-game-title glow-text">
              <span>PLAYER VS Player</span>
            </h1>
            <p className="ai-game-subtitle">
            Challenge Other Players.
            </p>
          </div>
        </div>
        <div className="ai-game-canvas-container">
        {isReady  && (
            <div className="pong-game-container">
            <div className="player-info-grid">
                <Card className="player-card player1-card">
                    <CardHeader className="player-card-header">
                    <CardTitle className="player-card-title">
                      <span style={gameState.P1_Id === id || gameState.P3_Id === id ? 
                          { color: 'hsl(217 91% 60%)', fontWeight: 'bold' } :  {}}>
                          {gameState.player1Name || "PLAYER1"} {mode == 4 ? " and " : ""} {gameState.player3Name|| (mode == 4 ? "PLAYER3" : "")}
                      </span>
                  </CardTitle>
                    </CardHeader>
                    <CardContent className="player-card-content">
                        <div className="player-score">
                            {gameState.score.player1}
                        </div>
                        <div className="player-controls">
                            {gameState.P1_Id === id || gameState.P3_Id === id ? (<span style={{ color: 'hsl(217 91% 60%)', fontWeight: 'bold' }}>Arrow Keys</span>) : ("Arrow Keys")}
                        </div>
                    </CardContent>
                </Card>
                
                <div className="game-controls-center">
                    <div style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: 'bold',
                        color:'#10b981'
                    }}>
                        {gameState.gameStatus}
                    </div>
                </div>
                
                <Card className="player-card player2-card">
                    <CardHeader className="player-card-header">
                    <CardTitle className="player-card-title">
                      <span style={gameState.P2_Id === id || gameState.P4_Id === id ? 
                          { color: 'hsl(217 91% 60%)', fontWeight: 'bold' } :  {}}>
                          {gameState.player2Name || "PLAYER2"} {mode == 4 ? " and " : ""} {gameState.player4Name || (mode == 4 ? "PLAYER4" : "") } 
                      </span>
                  </CardTitle>
                    </CardHeader>
                    <CardContent className="player-card-content">
                        <div className="player-score">
                            {gameState.score.player2}
                        </div>
                        <div className="player-controls">
                            {gameState.P2_Id === id || gameState.P4_Id === id ? (  <span style={{ color: 'hsl(217 91% 60%)', fontWeight: 'bold' }}>Arrow Keys</span> ) : ( "Arrow Keys" )}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="game-canvas-wrapper">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    tabIndex={0}
                    className="game-canvas"
                />
            </div>
        </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameOnline;