import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pause, Play, RotateCcw } from "lucide-react";
import React from "react";
import { formToJSON } from "axios";

interface PongCanvasProps {
    player1Name;
    player2Name;
    onGameEnd?: (player1Score: number, player2Score: number) => void;
    maxScore?: number;
    ws: WebSocket;
    mode: number;
}

interface GameState {
    paddle1: {
        x: number;
        y: number;
    };
    paddle2: {
        x: number;
        y: number;
    };
    ball: {
        x: number;
        y: number;
        dx: number;
        dy: number;
        radius: number;
    };
    paddle3: {
        x: number;
        y: number;
    };
    paddle4: {
        x: number;
        y: number;
    };
    score: {
        player1: number;
        player2: number;
    };
    Mode: number;
    sizePaddle: { width: number, height: number };
    gameStatus: string;
}
let vss: string = "Player 2x";
let keys = { ArrowUp: false, ArrowDown: false };
let Me: string = localStorage.getItem("email");
const email = localStorage.getItem("email");
export const PongCanvasOnline = ({
    player1Name,
    player2Name,
    // onGameEnd,
    // maxScore = 5,
    ws,
    mode
}: PongCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const keysPressed = useRef<Set<string>>(new Set());
    const gameStateRef = useRef<GameState | null>(null);

    // const wsRef = useRef(null);
    const [role, setRole] = useState(null);

    const [gameState, setGameState] = useState<GameState>({
        ball: {
            x: 400,
            y: 300,
            dx: Math.cos(Math.PI / 8),
            dy: Math.sin(Math.PI / 8),
            radius: 8
        },
        paddle1: {
            x: 20,
            y: 250
        },
        paddle2: {
            x: 765,
            y: 250
        },
        paddle3: {
            x: 60,
            y: 250,
        },
        paddle4: {
            x: 725,
            y: 250,
        },
        score: {
            player1: 0,
            player2: 0
        },
        sizePaddle: {
            width: 15,
            height: 100
        },
        Mode: 2,
        gameStatus: 'waiting',
    });

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
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

        // Draw paddles
        ctx.fillStyle = 'hsl(217 91% 60%)';
        ctx.fillRect(gameState.paddle1.x, gameState.paddle1.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
        ctx.fillRect(gameState.paddle2.x, gameState.paddle2.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
        if (gameState.Mode == 4) {
            ctx.fillRect(gameState.paddle3.x, gameState.paddle3.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
            ctx.fillRect(gameState.paddle4.x, gameState.paddle4.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
        }
        // Draw ball
        ctx.beginPath();
        ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'hsl(217 91% 60%)';
        ctx.fill();

        // Add glow effect to ball
        ctx.shadowColor = 'hsl(217 91% 60%)';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw scores
        ctx.fillStyle = 'hsl(210 40% 98%)';
        ctx.font = '48px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(gameState.score.player1.toString(), canvas.width / 4, 60);
        ctx.fillText(gameState.score.player2.toString(), (canvas.width * 3) / 4, 60);
    }, [gameState]);

    const gameLoop = useCallback(() => {
        draw();
        animationRef.current = requestAnimationFrame(gameLoop);
    }, [draw]);

    // *******
    useEffect(() => {
        if (gameState.gameStatus === "PLAYING") {
            animationRef.current = requestAnimationFrame(gameLoop);
        } else if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [gameState.gameStatus, gameLoop]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't block typing in inputs/textareas or contentEditable elements
            const target = e.target as HTMLElement | null;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;

            // While PLAYING, prevent ArrowUp/ArrowDown from scrolling the page
            if (gameState.gameStatus === 'PLAYING' && (e.code === 'ArrowUp' || e.code === 'ArrowDown')) {
                e.preventDefault();
            }

            keysPressed.current.add(e.code);
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.current.delete(e.code);
        };

        window.addEventListener('keydown', handleKeyDown, { passive: false });
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameState.gameStatus]);

    useEffect(() => {
        draw();
    }, [draw]);

    useEffect(() => {
        if (!ws) return;

        const handleMessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            vss = data.player1Name;
            if (data.player1Name == Me)
                vss = data.player2Name;
            setGameState((prev) => ({
                ...prev,
                count: data.count,
                mode: data.mode,
                ball: {
                    x: data.Ball_x,
                    y: data.Ball_y,
                    dx: data.ball_dx,
                    dy: data.ball_dy,
                    radius: data.ball_radius
                },
                paddle1: {
                    x: data.Player1_x,
                    y: data.Player1_y,
                },
                paddle2: {
                    x: data.Player2_x,
                    y: data.Player2_y,
                },
                paddle3: {
                    x: data.Player3_x,
                    y: data.Player3_y,
                },
                paddle4: {
                    x: data.Player4_x,
                    y: data.Player4_y,
                },
                score: {
                    player1: data.score1,
                    player2: data.score2
                },
                gameStatus: data.gameStatus,
                player2Name: vss,
            }));
        };

        ws.addEventListener("message", handleMessage);

        return () => {
            ws.removeEventListener("message", handleMessage);
        };
    }, [ws]);

    const resettGame = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.tabIndex = 0;
            canvas.focus({ preventScroll: true });
            canvas.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        ws.send(JSON.stringify({
            type: "RESET",
            email: email,
            tournement: false,
            keys,
            mode: mode,
            id: localStorage.getItem("email")
        }));
    };

    const startGame = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.tabIndex = 0;
            canvas.focus({ preventScroll: true });
            canvas.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        ws.send(JSON.stringify({
            type: "START",
            email: email,
            tournement: false,
            keys,
            mode: mode,
            id: localStorage.getItem("email")
        }));
    };

    const sendMove = (direction) => {
        if (!ws || ws.readyState !== ws.OPEN)
            return;
        ws.send(JSON.stringify({ type: "MOVE", direction, email, keys, tournement: false, mode: mode, id: localStorage.getItem("email") }));
    };

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.code === "ArrowUp" || e.code === "ArrowDown")
                e.preventDefault();
            if (e.code === "ArrowUp") {
                keys.ArrowUp = true;
                sendMove("up");
            }
            if (e.code === "ArrowDown") {
                keys.ArrowDown = true;
                sendMove("down");
            }
        };
        const onKeyD = (e: KeyboardEvent) => {
            if (e.code === "ArrowUp" || e.code === "ArrowDown")
                e.preventDefault();
            if (e.code === "ArrowUp") {
                keys.ArrowUp = false;
                sendMove("up");
            }
            if (e.code === "ArrowDown") {
                keys.ArrowDown = false;
                sendMove("down");
            }
        };
        window.addEventListener("keydown", onKey, { passive: false });
        window.addEventListener("keyup", onKeyD, { passive: false });
        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("keyup", onKeyD);
        }
    }, []);

    useEffect(() => { startGame(); }, []);

    return (
        <div className="space-y-6">
            {/* Player Info & Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

                {/* Player 1 Card */}
                <Card className="bg-gradient-secondary border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-center text-lg">{player1Name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="text-3xl font-game font-bold text-primary">
                            {gameState.score.player1}
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                            W / S Keys
                        </div>
                    </CardContent>
                </Card>

                {/* Center Controls */}
                <div className="flex flex-col items-center justify-center space-y-4">
                    {/* {gameState.gameStatus === 'waiting' && (
            <Button onClick={startGame} className="bg-gradient-primary flex items-center">
              <Play className="w-4 h-4 mr-2" />
              Start Game
            </Button>
          )} */}
                    {gameState.gameStatus == 'FINISHED' && < Button onClick={resettGame} className="px-2 py-1 text-sm border border-border flex items-center">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                    }
                </div>

                {/* Player 2 Card */}
                <Card className="bg-gradient-secondary border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-center text-lg">{player2Name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="text-3xl font-game font-bold text-primary">
                            {gameState.score.player2}
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                            Arrow Keys
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Game Canvas */}
            <div className="flex justify-center mt-6">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    tabIndex={0}
                    className="border border-border rounded-lg bg-card shadow-card focus:outline-none"
                />
            </div>

        </div >
    );

};




