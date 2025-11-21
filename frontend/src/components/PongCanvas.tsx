import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pause, Play, RotateCcw } from "lucide-react";

interface PongCanvasProps {
  player1Name?: string;
  player2Name?: string;
  player3Name?: string;
  player4Name?: string;
  onGameEnd?: (player1Score: number, player2Score: number) => void;
  maxScore?: number;
}

interface GameState {
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
  gameStatus: 'waiting' | 'playing' | 'paused' | 'finished';
}

const BALL_SPEED = 5;
const paddleSpeed = 10;
const accelerateSpeed = 1.002;
const max_Speed = 25;
const angle = (Math.PI / 8);

export const PongCanvas = ({
  player1Name = "Player 1",
  player2Name = "Player 2",
  player3Name = "Player 3",
  player4Name = "Player 4",
  onGameEnd,
  maxScore = 5
}: PongCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const lastTimeRef = useRef<number | null>(null);
  const gameStateRef = useRef<GameState | null>(null);
  let Mode = 4; //2 players
  // let [Mode, setMode] = useState(0);
  // setMode(2);
  const [gameState, setGameState] = useState<GameState>({
    ball: {
      x: 400,
      y: 300,
      dx: BALL_SPEED * Math.cos(angle),
      dy: BALL_SPEED * Math.sin(angle),
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

  const createBall = useCallback(() => {
    const dirx = Math.random() > 0.5 ? 1 : -1;
    const diry = Math.random() > 0.5 ? 1 : -1;
    return {
      x: 400,
      y: 300,
      dx: dirx * BALL_SPEED * Math.cos(angle),
      dy: diry * BALL_SPEED * Math.sin(angle),
      radius: 8
    };
  }, []);

  const resetGame = useCallback(() => {
    lastTimeRef.current = null;
    setGameState(prev => ({
      ...prev,
      ball: createBall(),
      paddle1: { ...prev.paddle1, y: 250 },
      paddle2: { ...prev.paddle2, y: 250 },
      paddle3: { ...prev.paddle3, y: 250 },
      paddle4: { ...prev.paddle4, y: 250 },
      score: { player1: 0, player2: 0 },
      gameStatus: 'waiting'
    }));
  }, [createBall]);

  const resetBall = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      ball: createBall()
    }));
  }, [createBall]);


  const updateGame = useCallback((delta: number) => {
    if (!gameStateRef.current) return;
    const prev = gameStateRef.current;
    if (prev.gameStatus !== 'playing') return;

    const newState = { ...prev };
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Paddles movement
    if (keysPressed.current.has('KeyW') && newState.paddle1.y > 0) newState.paddle1.y -= paddleSpeed * delta;
    if (keysPressed.current.has('KeyS') && newState.paddle1.y < canvas.height - newState.paddle1.height) newState.paddle1.y += paddleSpeed * delta;
    if (keysPressed.current.has('ArrowUp') && newState.paddle2.y > 0) newState.paddle2.y -= paddleSpeed * delta;
    if (keysPressed.current.has('ArrowDown') && newState.paddle2.y < canvas.height - newState.paddle2.height) newState.paddle2.y += paddleSpeed * delta;
    if (Mode == 4) {
      if (keysPressed.current.has('KeyP') && newState.paddle3.y > 0) newState.paddle3.y -= paddleSpeed * delta;
      if (keysPressed.current.has('KeyL') && newState.paddle3.y < canvas.height - newState.paddle3.height) newState.paddle3.y += paddleSpeed * delta;
      if (keysPressed.current.has('KeyU') && newState.paddle4.y > 0) newState.paddle4.y -= paddleSpeed * delta;
      if (keysPressed.current.has('KeyH') && newState.paddle4.y < canvas.height - newState.paddle4.height) newState.paddle4.y += paddleSpeed * delta;
    }
    // Ball movement
    newState.ball.x += newState.ball.dx * delta;
    newState.ball.y += newState.ball.dy * delta;
    if (newState.ball.dy * newState.ball.dy + newState.ball.dx * newState.ball.dx < max_Speed * max_Speed) {
      newState.ball.dx *= accelerateSpeed;
      newState.ball.dy *= accelerateSpeed;
    }

    // console.log(accelerateSpeed, newState.ball.dx, " ----- ", newState.ball.dy, " === ", newState.ball.dy * newState.ball.dy + newState.ball.dx * newState.ball.dx)
    // Ball collision with top/bottom
    if (newState.ball.y <= newState.ball.radius || newState.ball.y >= canvas.height - newState.ball.radius) {
      newState.ball.dy = -newState.ball.dy;
    }

    const ball = newState.ball;
    const p1 = newState.paddle1;
    const p2 = newState.paddle2;
    const p3 = newState.paddle3;
    const p4 = newState.paddle4;
    const incomingDx = ball.dx;
    const incomingDy = ball.dy;

    // Left paddle collision
    if (ball.x - ball.radius <= p1.x + p1.width &&
      ball.x - ball.radius >= p1.x &&
      ball.y + ball.radius >= p1.y &&
      ball.y - ball.radius <= p1.y + p1.height &&
      ball.dx < 0) {
      ball.x = p1.x + p1.width + ball.radius;
      ball.dx = -incomingDx;
      ball.dy = incomingDy;
    }

    // Right paddle collision
    if (ball.x + ball.radius >= p2.x &&
      ball.x + ball.radius <= p2.x + p2.width &&
      ball.y + ball.radius >= p2.y &&
      ball.y - ball.radius <= p2.y + p2.height &&
      ball.dx > 0) {
      ball.x = p2.x - ball.radius;
      ball.dx = -incomingDx;
      ball.dy = incomingDy;
    }
 if (Mode === 4) {
      if (ball.x - ball.radius <= p3.x + p3.width &&
        ball.x - ball.radius >= p3.x &&
        ball.y + ball.radius >= p3.y &&
        ball.y - ball.radius <= p3.y + p3.height &&
        ball.dx < 0) {
        ball.x = p3.x + p3.width + ball.radius;
        ball.dx = -incomingDx;
        ball.dy = incomingDy;
      }
      if (ball.x + ball.radius >= p4.x &&
        ball.x + ball.radius <= p4.x + p4.width &&
        ball.y + ball.radius >= p4.y &&
        ball.y - ball.radius <= p4.y + p4.height &&
        ball.dx > 0) {
        ball.x = p4.x - ball.radius;
        ball.dx = -incomingDx;
        ball.dy = incomingDy;
      }
    }
    // Scoring
    if (ball.x < 0) {
      newState.score.player2++;
      newState.ball = createBall();
    } else if (ball.x > canvas.width) {
      // console.log("Speed == ", Math.sqrt((ball.dx * ball.dx) + (ball.dy * ball.dy)))
      newState.score.player1++;
      newState.ball = createBall();
    }
    // Check game end
    if (newState.score.player1 >= maxScore || newState.score.player2 >= maxScore) {
      newState.gameStatus = 'finished';
      if (onGameEnd) {
        onGameEnd(newState.score.player1, newState.score.player2);
        lastTimeRef.current = null;
      }
    }

    // Update refs and state
    gameStateRef.current = newState;
    setGameState(newState);
  }, [maxScore, onGameEnd, createBall]);
  // *****

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
   if (Mode == 4) {
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
    let delta = 1;
    if (lastTimeRef.current != null)
      delta = (time - lastTimeRef.current) / 16.67;
    lastTimeRef.current = time;

    updateGame(delta);
    draw();
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, draw]);

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

  // console.log("Mode == ", Mode);
  const startGame = () => {
    // setMode(8/Mode);
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

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, gameStatus: 'paused' }));
  };

  const resumeGame = () => {
    lastTimeRef.current = null;
    setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
  };

  return (
    <div className="space-y-6">
      {/* Game Info */}
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
            {gameState.gameStatus === 'playing' && (
              <Button onClick={pauseGame} className="border border-border">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            {gameState.gameStatus === 'paused' && (
              <Button onClick={resumeGame} className="bg-gradient-primary">
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            )}
            <div className="flex space-x-2">
              <Button onClick={resetGame} className="px-2 py-1 text-sm border border-border">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
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