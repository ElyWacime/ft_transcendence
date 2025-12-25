import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pause, Play, RotateCcw } from "lucide-react";
import React from "react";

function usePongWebSocket(ws, mode, email, setGameState) {
    useEffect(() => {
        if (!ws) return;

        const handleMessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            // console.log("MODE === ", localStorage.getItem("email"), data.player1Name, data.player2email, data.player3email, data.player4email);
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
                player1Name: data.player1Name,
                player2Name: data.player2Name,
                player3Name: data.player3Name || "",
                player4Name: data.player4Name || "",
                player1email: data.player1email|| "",
                player2email: data.player2email|| "",
                player3email: data.player3email|| "",
                player4email: data.player4email|| ""
            }));
        };

        ws.addEventListener("message", handleMessage);
        // start game automatically
        ws.send(JSON.stringify({
            token: localStorage.getItem("token"),
            type: "START",
            email,
            mode,
            tournement: false,
            keys: {},
            id: email
        }));

        return () => ws.removeEventListener("message", handleMessage);
    }, [ws]);
}

function usePongControls(ws, mode, email) {
    const keys = useRef({ ArrowUp: false, ArrowDown: false });

    const sendMove = (direction: string) => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;

        ws.send(JSON.stringify({
            token:localStorage.getItem("token"),
            type: "MOVE",
            direction,
            email,
            tournement: false,
            keys: keys.current,
            mode,
            id: email
        }));
    };

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
    }, [ws]);
}

function usePongRenderer(canvasRef, gameState) {
    const animationRef = useRef(0);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

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
        ctx.fillStyle = "hsl(217 91% 60%)";
        ctx.fillRect(gameState.paddle1.x, gameState.paddle1.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
        ctx.fillStyle = "hsl(217 91% 60%)";
        ctx.fillRect(gameState.paddle2.x, gameState.paddle2.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
        if (gameState.Mode == 4) {
            if (gameState.player1email == localStorage.getItem("email"))
                ctx.fillStyle = 'hsl(0 50% 80%)';
            else
                ctx.fillStyle = "hsl(217 91% 60%)";
            ctx.fillRect(gameState.paddle1.x, gameState.paddle1.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
            if (gameState.player2email == localStorage.getItem("email"))
                ctx.fillStyle = 'hsl(60 50% 80%)';
            else
                ctx.fillStyle = "hsl(217 91% 60%)";
            ctx.fillRect(gameState.paddle2.x, gameState.paddle2.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
            if (gameState.player3email == localStorage.getItem("email"))
                ctx.fillStyle = 'hsl(120 50% 80%)';
            else
                ctx.fillStyle = "hsl(217 91% 60%)";
            ctx.fillRect(gameState.paddle3.x, gameState.paddle3.y, gameState.sizePaddle.width, gameState.sizePaddle.height);

            if (gameState.player4email == localStorage.getItem("email"))
                ctx.fillStyle = 'hsl(300 50% 80%)';
            else
                ctx.fillStyle = "hsl(217 91% 60%)";
            ctx.fillRect(gameState.paddle4.x, gameState.paddle4.y, gameState.sizePaddle.width, gameState.sizePaddle.height);
        }

        ctx.beginPath();
        ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'hsl(217 91% 60%)';
        ctx.fill();

        ctx.shadowColor = 'hsl(217 91% 60%)';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = 'hsl(210 40% 98%)';
        ctx.font = '48px "JetBrains Mono"';
        ctx.textAlign = 'center';
        ctx.fillText(gameState.score.player1.toString(), canvas.width / 4, 60);
        ctx.fillText(gameState.score.player2.toString(), (canvas.width * 3) / 4, 60);
    }, [gameState]);

    const loop = useCallback(() => {
        draw();
        animationRef.current = requestAnimationFrame(loop);
    }, [draw]);

    useEffect(() => {
        animationRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationRef.current);
    }, [loop]);
}

export const PongCanvasOnline = ({ player1Name, player2Name, player3Name, player4Name,player1email, player2email, player3email, player4email, ws, mode }) => {
    const email = localStorage.getItem("email");
    const canvasRef = useRef(null);

    const [gameState, setGameState] = useState({
        ball: { x: 400, y: 300, dx: 1, dy: 1, radius: 8 },
        paddle1: { x: 20, y: 250 },
        paddle2: { x: 765, y: 250 },
        paddle3: { x: 60, y: 250 },
        paddle4: { x: 725, y: 250 },
        score: { player1: 0, player2: 0 },
        sizePaddle: { width: 15, height: 100 },
        Mode: mode,
        player1Name,
        player2Name,
        player3Name,
        player4Name,
        player1email,
        player2email,
        player3email,
        player4email,
        gameStatus: "PENDING",
    });

    usePongWebSocket(ws, mode, email, setGameState);
    usePongControls(ws, mode, email);
    usePongRenderer(canvasRef, gameState);

    return (
        <div className="space-y-6">
            {/* Player Info & Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

                {/* Player 1 Card */}
                <Card className="bg-gradient-secondary border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-center text-lg">{player1Name} {mode == 4 ? " // ":"" }   { player3Name}</CardTitle>
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
                    {gameState.gameStatus == 'FINISHED' && < Button className="px-2 py-1 text-sm border border-border flex items-center">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                    }
                </div>

                {/* Player 2 Card */}
                <Card className="bg-gradient-secondary border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-center text-lg">{player2Name }{mode == 4 ? " // ":"" }  { player4Name}</CardTitle>
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










