import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pause, Play, RotateCcw } from "lucide-react";

interface PongCanvasProps {
  player1Name?: string;
  player2Name?: string;
  onGameEnd?: (player1Score: number, player2Score: number) => void;
  maxScore?: number;
}

interface GameState {
  Mode: number;
  ball: {
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
  };
  paddle1: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  paddle2: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  paddle3: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  paddle4: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  score: {
    player1: number;
    player2: number;
  };
  gameStatus: string;
}

export const PongCanvasOnline = ({
  player1Name = localStorage.getItem("email"),
  player2Name = "Player 2",
  onGameEnd,
  maxScore = 5
}: PongCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const gameStateRef = useRef<GameState | null>(null);


  const [gameState, setGameState] = useState<GameState>({
    Mode:2,
    ball: {
      x: 400,
      y: 300,
      dx: Math.cos(Math.PI/8),
      dy: Math.sin(Math.PI/8),
      radius: 8
    },
    paddle1: {
      x: 20,
      y: 250,
      width: 15,
      height: 100
    },
    paddle2: {
      x: 765,
      y: 250,
      width: 15,
      height: 100
    },
    paddle3: {
      x: 60,
      y: 250,
      width: 15,
      height: 100
    },
    paddle4: {
      x: 725,
      y: 250,
      width: 15,
      height: 100
    },
    score: {
      player1: 0,
      player2: 0
    },
    gameStatus: 'waiting'
  });

  const updateGame = useCallback((delta: number) => {
    if (!gameStateRef.current) return;
    const prev = gameStateRef.current;
    if (prev.gameStatus !== 'playing') return;

    const newState = { ...prev };
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Update Game state
    gameStateRef.current = newState;
    setGameState(newState);
  }, [maxScore, onGameEnd]);

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
    ctx.fillRect(gameState.paddle1.x, gameState.paddle1.y, gameState.paddle1.width, gameState.paddle1.height);
    ctx.fillRect(gameState.paddle2.x, gameState.paddle2.y, gameState.paddle2.width, gameState.paddle2.height);
   if (gameState.Mode == 4) {
      ctx.fillRect(gameState.paddle3.x, gameState.paddle3.y, gameState.paddle3.width, gameState.paddle3.height);
      ctx.fillRect(gameState.paddle4.x, gameState.paddle4.y, gameState.paddle4.width, gameState.paddle4.height);
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


  const gameLoop = useCallback((time: number) => {
    draw();
    animationRef.current = requestAnimationFrame(draw);
  }, [draw]);

  // *******
  useEffect(() => {
    if (gameState.gameStatus === "playing") {
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

      // While playing, prevent ArrowUp/ArrowDown from scrolling the page
      if (gameState.gameStatus === 'playing' && (e.code === 'ArrowUp' || e.code === 'ArrowDown')) {
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

  const startGame = () => {
    setGameState(prev => {
      const next = { ...prev, gameStatus: "playing" };
      gameStateRef.current = next;
      return next;
    });
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.tabIndex = 0;
      canvas.focus({ preventScroll: true });
      canvas.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };


// useEffect(() => {
//   // Connect to WebSocket
//   const ws = new WebSocket("ws://localhost:3000/"); // matches your Fastify route

//   ws.onopen = () => console.log("Connected to WS server");

//   ws.onmessage = (event) => {
//     try {
//       const data = JSON.parse(event.data);
//       console.log("Received from server:", data);
//     } catch (err) {
//       console.error("Failed to parse WS message:", err);
//     }
//   };

//   ws.onclose = () => console.log("WS connection closed");
//   ws.onerror = (err) => console.error("WS error:", err);

//   // Send key presses
//   const handleKey = (e: KeyboardEvent) => {
//     if (!ws || ws.readyState !== WebSocket.OPEN) return;

//     if (e.key === "ArrowUp" || e.key === "ArrowDown") {
//       ws.send(JSON.stringify({
//         email: localStorage.getItem("email"),
//         type: "userKeyPress",
//         key: e.key
//       }));
//     }
//   };

//   window.addEventListener("keydown", handleKey);

//   return () => {
//     ws.close();
//     window.removeEventListener("keydown", handleKey);
//   };
// }, []);

  const [count, setCount] = useState(10);

  const handleAction = async (action) => {
    const endpoint = (action == 'up' ? 'multiply' : 'divide');
    try {
      const res = await fetch(`http://localhost:3000/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      // only update if server returned a numeric count
      const n = Number(data.count);
      if (!Number.isNaN(n))
      {
         setCount(n);
         console.log(`Count updated to ${n}`);
      }
    } catch (err) {
      console.error('Error sending count to server:', err);
    }
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowUp') {
        handleAction('up');
      } else if (e.key === 'ArrowDown') {
        handleAction('down');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count]);

  return (
    <div className="space-y-6">
      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-secondary border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-lg">{player1Name}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-game font-bold text-primary">
              {gameState.score.player1}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              W/S Keys
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center">
          <div className="space-y-2">
            {gameState.gameStatus === 'waiting' && (
              <Button onClick={startGame} className="bg-gradient-primary">
                <Play className="w-4 h-4 mr-2" />
                Start Game
              </Button>
            )}
            <div className="flex space-x-2">
              <Button className="px-2 py-1 text-sm border border-border">
                <RotateCcw className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>
        </div>

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
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          tabIndex={0}
          className="border border-border rounded-lg bg-card shadow-card"
        />
      </div>
    </div>

  );
};




