import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { decodeJWT } from "@/lib/jwt-utils";

export const PongCanvasOnline = ({ player1Name, player2Name, player3Name, player4Name, ws, mode, isReady }) => {
    const canvasRef = useRef(null);
    const keys = useRef({ ArrowUp: false, ArrowDown: false });
    const matchref = useRef(null);
    const animationRef = useRef(0);
    const hasRequestedState = useRef(false);
    
    const [gameState, setGameState] = useState({
        ball: { x: 400, y: 300, dx: 1, dy: 1, radius: 8 },
        paddle1: { x: 20, y: 250 },
        paddle2: { x: 765, y: 250 },
        paddle3: { x: 60, y: 250 },
        paddle4: { x: 725, y: 250 },
        score: { player1: 0, player2: 0 },
        sizePaddle: { width: 15, height: 100 },
        Mode: mode,
        player1Name: player1Name,
        player2Name: player2Name,
        player3Name: player3Name,
        player4Name: player4Name,
        P1_Id: "",
        P2_Id: "",
        P3_Id: "",
        P4_Id: "",
        gameStatus: "PENDING",
    });
    
    // Get user ID from token
    let token = localStorage.getItem("token");
    let id = null;
    if (token) {
        const decoded = decodeJWT(token);
        id = decoded?.id || null;
    }
    
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        // Clear canvas
        ctx.fillStyle = 'hsl(222 47% 4%)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw center line
        ctx.strokeStyle = 'hsl(222 47% 12%)';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw paddles based on mode
        if (gameState.Mode == 4) {
            // Player 1 paddle
            ctx.fillStyle = gameState.P1_Id == id ? 'hsl(0 50% 80%)' : 'hsl(217 91% 60%)';
            ctx.fillRect(gameState.paddle1.x, gameState.paddle1.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
            
            // Player 2 paddle
            ctx.fillStyle = gameState.P2_Id == id ? 'hsl(60 50% 80%)' : 'hsl(217 91% 60%)';
            ctx.fillRect(gameState.paddle2.x, gameState.paddle2.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
            
            // Player 3 paddle
            ctx.fillStyle = gameState.P3_Id == id ? 'hsl(120 50% 80%)' : 'hsl(217 91% 60%)';
            ctx.fillRect(gameState.paddle3.x, gameState.paddle3.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
            
            // Player 4 paddle
            ctx.fillStyle = gameState.P4_Id == id ? 'hsl(300 50% 80%)' : 'hsl(217 91% 60%)';
            ctx.fillRect(gameState.paddle4.x, gameState.paddle4.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
        } else {
            // 2-player mode
            ctx.fillStyle = 'hsl(217 91% 60%)';
            ctx.fillRect(gameState.paddle1.x, gameState.paddle1.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
            ctx.fillRect(gameState.paddle2.x, gameState.paddle2.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
        }

        // Draw ball with glow
        ctx.beginPath();
        ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'hsl(217 91% 60%)';
        ctx.shadowColor = 'hsl(217 91% 60%)';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
        
    }, [gameState, id]);

    const loop = useCallback(() => {
        draw();
        animationRef.current = requestAnimationFrame(loop);
    }, [draw]);

    const sendMove = useCallback((direction: "up" | "down") => {
        if (!ws || !isReady || ws.readyState !== WebSocket.OPEN) return;
        
        // Only send moves if game is playing
        if (gameState.gameStatus !== "PLAYING") {
            return;
        }
        
        ws.send(JSON.stringify({
            token: localStorage.getItem("token"),
            type: "MOVE",
            direction,
            keys: keys.current,
            mode,
            matchId: matchref.current
        }));
    }, [ws, isReady, mode, gameState.gameStatus]);

    const handleMessage = useCallback((event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data);
            
            if (data) {
                // Update match ID if provided
                if (data.id) {
                    matchref.current = data.id;
                }
                
                // Update game state with received data
                setGameState((prev) => ({
                    ...prev,
                    ball: {
                        x: data.Ball_x ?? prev.ball.x,
                        y: data.Ball_y ?? prev.ball.y,
                        dx: data.ball_dx ?? prev.ball.dx,
                        dy: data.ball_dy ?? prev.ball.dy,
                        radius: data.ball_radius ?? prev.ball.radius
                    },
                    paddle1: { 
                        x: data.Player1_x ?? prev.paddle1.x, 
                        y: data.Player1_y ?? prev.paddle1.y 
                    },
                    paddle2: { 
                        x: data.Player2_x ?? prev.paddle2.x, 
                        y: data.Player2_y ?? prev.paddle2.y 
                    },
                    paddle3: { 
                        x: data.Player3_x ?? prev.paddle3.x, 
                        y: data.Player3_y ?? prev.paddle3.y 
                    },
                    paddle4: { 
                        x: data.Player4_x ?? prev.paddle4.x, 
                        y: data.Player4_y ?? prev.paddle4.y 
                    },
                    score: { 
                        player1: data.score1 ?? prev.score.player1, 
                        player2: data.score2 ?? prev.score.player2 
                    },
                    gameStatus: data.gameStatus ?? prev.gameStatus,
                    player1Name: data.player1Name ?? prev.player1Name,
                    player2Name: data.player2Name ?? prev.player2Name,
                    player3Name: data.player3Name ?? prev.player3Name,
                    player4Name: data.player4Name ?? prev.player4Name,
                    P1_Id: data.P1_Id ?? prev.P1_Id,
                    P2_Id: data.P2_Id ?? prev.P2_Id,
                    P3_Id: data.P3_Id ?? prev.P3_Id,
                    P4_Id: data.P4_Id ?? prev.P4_Id,
                    Mode: data.mode ?? prev.Mode
                }));
            }
        } catch (error) {
            console.error("Error handling message:", error);
        }
    }, []);

    // Request current game state when component mounts
    useEffect(() => {
        if (!ws || !isReady || ws.readyState !== WebSocket.OPEN || !matchref.current || hasRequestedState.current) return;
        
        console.log("Requesting current game state");
        ws.send(JSON.stringify({
            token: localStorage.getItem("token"),
            type: "GET_GAME_STATE",
            matchId: matchref.current
        }));
        
        hasRequestedState.current = true;
    }, [ws, isReady]);

    // Setup WebSocket message listener
    useEffect(() => {
        if (!ws || !isReady || ws.readyState !== WebSocket.OPEN) return;
        
        ws.addEventListener("message", handleMessage);
        
        return () => {
            ws.removeEventListener("message", handleMessage);
        };
    }, [ws, isReady, handleMessage]);

    // Setup keyboard controls
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code === "ArrowUp" || e.code === "ArrowDown") {
                e.preventDefault();
            }
            if (e.code === "ArrowUp") {
                keys.current.ArrowUp = true;
                sendMove("up");
            }
            if (e.code === "ArrowDown") {
                keys.current.ArrowDown = true;
                sendMove("down");
            }
        };

        const onKeyUp = (e: KeyboardEvent) => {
            if (e.code === "ArrowUp" || e.code === "ArrowDown") {
                e.preventDefault();
            }
            if (e.code === "ArrowUp") {
                keys.current.ArrowUp = false;
                sendMove("up");
            }
            if (e.code === "ArrowDown") {
                keys.current.ArrowDown = false;
                sendMove("down");
            }
        };

        window.addEventListener("keydown", onKeyDown, { passive: false });
        window.addEventListener("keyup", onKeyUp, { passive: false });

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, [sendMove]);

    // Animation loop
    useEffect(() => {
        animationRef.current = requestAnimationFrame(loop);
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [loop]);

    return (
        <div className="pong-game-container">
            <div className="player-info-grid">
                <Card className="player-card player1-card">
                    <CardHeader className="player-card-header">
                    <CardTitle className="player-card-title">
                      <span style={gameState.P1_Id === id || gameState.P3_Id === id ? 
                          { color: 'hsl(217 91% 60%)', fontWeight: 'bold' } :  {}}>
                          {gameState.player1Name || "PLAYER1"} {mode == 4 ? " // " : ""} {gameState.player3Name}
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
                        color: gameState.gameStatus === 'PLAYING' ? '#10b981' : 
                               gameState.gameStatus === 'PENDING' ? '#f59e0b' : '#6b7280'
                    }}>
                        {gameState.gameStatus}
                    </div>
                </div>
                
                <Card className="player-card player2-card">
                    <CardHeader className="player-card-header">
                    <CardTitle className="player-card-title">
                      <span style={gameState.P2_Id === id || gameState.P4_Id === id ? 
                          { color: 'hsl(217 91% 60%)', fontWeight: 'bold' } :  {}}>
                          {gameState.player2Name || "PLAYER1"} {mode == 4 ? " // " : ""} {gameState.player4Name}
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
                {gameState.gameStatus === "PENDING" && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                    }}>
                        <div style={{ textAlign: 'center', color: 'white' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'hsl(217 91% 60%)' }}>
                                Waiting for game to start...
                            </h3>
                            <p style={{ color: '#999' }}>Please wait while players connect</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};