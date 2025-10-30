import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

interface PongCanvasProps {
  player1Name?: string;
  player2Name?: string;
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
  score: {
    player1: number;
    player2: number;
  };
  gameStatus: 'waiting' | 'playing' | 'paused' | 'finished';
}

export const PongCanvas = ({ 
  player1Name = "Player 1", 
  player2Name = "Player 2", 
  onGameEnd,
  maxScore = 5 
}: PongCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const keysPressed = useRef<Set<string>>(new Set());
  
  const [gameState, setGameState] = useState<GameState>({
    ball: {
      x: 400,
      y: 300,
      dx: 1.5,
      dy: 0.5,
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
    score: {
      player1: 0,
      player2: 0
    },
    gameStatus: 'waiting'
  });
  // helper to create a fresh ball object (keeps logic in one place)
  const createBall = useCallback(() => {
    // small random angle so ball isn't perfectly horizontal
    const angle =  (Math.PI / 6); // +/- 30 degrees
    // const angle = (Math.random() - 0.5) * (Math.PI / 6); // +/- 30 degrees
    const dir = Math.random() > 0.5 ? 1 : -1;
    return {
      x: 400,
      y: 300,
      dx: dir * BALL_SPEED * Math.cos(angle),
      dy: BALL_SPEED * Math.sin(angle),
      radius: 8
    };
  }, []);

  // Physics tuning constants
  const SPIN_FACTOR = 0.08; // how strongly paddle offset affects vertical velocity
  const MAX_DY = 6; // clamp for vertical velocity
  const BALL_SPEED = 0.9; // constant total speed (pixels per frame)
  const WALL_BOUNCE_DY_REDUCTION = 0.6; // reduce vertical component on wall bounce to widen angle

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      ball: createBall(),
      paddle1: { ...prev.paddle1, y: 250 },
      paddle2: { ...prev.paddle2, y: 250 },
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

  const updateGame = useCallback(() => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing') return prev;

      const newState = { ...prev };
      const canvas = canvasRef.current;
      if (!canvas) return prev;

      // Move paddles based on keys
      const paddleSpeed = 2;
      if (keysPressed.current.has('KeyW') && newState.paddle1.y > 0) {
        newState.paddle1.y -= paddleSpeed;
      }
      if (keysPressed.current.has('KeyS') && newState.paddle1.y < canvas.height - newState.paddle1.height) {
        newState.paddle1.y += paddleSpeed;
      }
      if (keysPressed.current.has('ArrowUp') && newState.paddle2.y > 0) {
        newState.paddle2.y -= paddleSpeed;
      }
      if (keysPressed.current.has('ArrowDown') && newState.paddle2.y < canvas.height - newState.paddle2.height) {
        newState.paddle2.y += paddleSpeed;
      }

      // Move ball
      newState.ball.x += newState.ball.dx;
      newState.ball.y += newState.ball.dy;

      // Ball collision with top/bottom walls
      if (newState.ball.y <= newState.ball.radius) {
        // Hit top: force vertical component to go down (positive)
        newState.ball.dy = Math.abs(newState.ball.dy) || 0.5;
        // reduce vertical component to widen outgoing angle
        newState.ball.dy *= WALL_BOUNCE_DY_REDUCTION;
        // clamp vertical speed for safety
        newState.ball.dy = Math.max(-MAX_DY, Math.min(MAX_DY, newState.ball.dy));
        // recompute horizontal component so total speed remains BALL_SPEED
        const signX = Math.sign(newState.ball.dx) || (Math.random() > 0.5 ? 1 : -1);
        const dyAbs = Math.abs(newState.ball.dy);
        const dxMag = Math.sqrt(Math.max(0, BALL_SPEED * BALL_SPEED - dyAbs * dyAbs));
        newState.ball.dx = signX * dxMag;
      } else if (newState.ball.y >= canvas.height - newState.ball.radius) {
        // Hit bottom: force vertical component to go up (negative)
        newState.ball.dy = -Math.abs(newState.ball.dy) || -0.5;
        // reduce vertical component to widen outgoing angle
        newState.ball.dy *= WALL_BOUNCE_DY_REDUCTION;
        // clamp vertical speed for safety
        newState.ball.dy = Math.max(-MAX_DY, Math.min(MAX_DY, newState.ball.dy));
        // recompute horizontal component so total speed remains BALL_SPEED
        const signX = Math.sign(newState.ball.dx) || (Math.random() > 0.5 ? 1 : -1);
        const dyAbs = Math.abs(newState.ball.dy);
        const dxMag = Math.sqrt(Math.max(0, BALL_SPEED * BALL_SPEED - dyAbs * dyAbs));
        newState.ball.dx = signX * dxMag;
      }

  // Ball collision with paddles
  const ball = newState.ball;
  // store incoming velocity before collision adjustments
  const incomingDx = ball.dx;
  const incomingDy = ball.dy;
  const p1 = newState.paddle1;
  const p2 = newState.paddle2;

      // Left paddle collision
      if (ball.x - ball.radius <= p1.x + p1.width &&
          ball.y >= p1.y &&
          ball.y <= p1.y + p1.height &&
          ball.dx < 0) {
        // Nudge ball outside the paddle to avoid repeat collisions
        ball.x = p1.x + p1.width + ball.radius;
        // detect whether paddle moved this frame (using prev)
        const p1Moved = prev.paddle1.y !== p1.y;
        if (!p1Moved) {
          // Paddle didn't move: preserve incoming angle (keep dy) and flip horizontal direction
          const dy = incomingDy;
          const dxMag = Math.sqrt(Math.max(0, BALL_SPEED * BALL_SPEED - dy * dy));
          ball.dx = Math.abs(dxMag); // go right
          ball.dy = dy;
        } else {
          // Paddle moved: apply spin based on impact point relative to paddle center
          ball.dx = -ball.dx; // reverse horizontal direction
          ball.dy += (ball.y - (p1.y + p1.height / 2)) * SPIN_FACTOR;
          // Clamp vertical speed
          ball.dy = Math.max(-MAX_DY, Math.min(MAX_DY, ball.dy));
          // Normalize overall speed to BALL_SPEED so collisions don't change magnitude
          const speed = Math.hypot(ball.dx, ball.dy) || 1;
          const scale = 1;
          // const scale = BALL_SPEED / speed;
          ball.dx *= scale;
          ball.dy *= scale;
        }
      }

      // Right paddle collision
      if (ball.x + ball.radius >= p2.x &&
          ball.y >= p2.y &&
          ball.y <= p2.y + p2.height &&
          ball.dx > 0) {
        // Nudge ball outside the paddle to avoid repeat collisions
        ball.x = p2.x - ball.radius;
        // detect whether paddle moved this frame
        const p2Moved = prev.paddle2.y !== p2.y;
        if (!p2Moved) {
          // Paddle didn't move: preserve incoming angle (keep dy) and flip horizontal direction
          const dy = incomingDy;
          const dxMag = Math.sqrt(Math.max(0, BALL_SPEED * BALL_SPEED - dy * dy));
          ball.dx = -Math.abs(dxMag); // go left
          ball.dy = dy;
        } else {
          // Paddle moved: apply spin based on impact point relative to paddle center
          ball.dx = -ball.dx; // reverse horizontal direction
          ball.dy += (ball.y - (p2.y + p2.height / 2)) * SPIN_FACTOR;
          // Clamp vertical speed
          ball.dy = Math.max(-MAX_DY, Math.min(MAX_DY, ball.dy));
          // Normalize overall speed to BALL_SPEED so collisions don't change magnitude
          const speed = Math.hypot(ball.dx, ball.dy) || 1;
          const scale = BALL_SPEED / speed;
          ball.dx *= scale;
          ball.dy *= scale;
        }
      }

      // Scoring
      if (ball.x < 0) {
        newState.score.player2++;
        newState.ball = createBall();
      } else if (ball.x > canvas.width) {
        newState.score.player1++;
        newState.ball = createBall();
      }

      // Check for game end
      if (newState.score.player1 >= maxScore || newState.score.player2 >= maxScore) {
        newState.gameStatus = 'finished';
        if (onGameEnd) {
          onGameEnd(newState.score.player1, newState.score.player2);
        }
      }

      return newState;
    });
  }, [maxScore, onGameEnd, resetBall]);

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
    updateGame();
    draw();
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, draw]);

  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      gameLoop();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
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
    setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
    // Focus and center the canvas in the viewport when the game starts
    const canvas = canvasRef.current;
    if (canvas) {
      // make sure the canvas is focusable and receive keyboard events
      canvas.tabIndex = 0;
      canvas.focus({ preventScroll: true });
      // center the canvas smoothly in the viewport
      canvas.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, gameStatus: 'paused' }));
  };

  const resumeGame = () => {
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
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            tabIndex={0}
            onFocus={() => {
              /* keep focus on canvas for keyboard controls */
            }}
            className="border border-border rounded-lg bg-card shadow-card"
          />
          {gameState.gameStatus === 'finished' && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Card className="bg-gradient-secondary border-border text-center">
                <CardHeader>
                  <CardTitle className="font-game text-2xl glow-text">Game Over!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-lg">
                    {gameState.score.player1 > gameState.score.player2 ? player1Name : player2Name} Wins!
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Final Score: {gameState.score.player1} - {gameState.score.player2}
                  </div>
                  <Button onClick={resetGame} className="bg-gradient-primary">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Play Again
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Controls Help */}
      <Card className="bg-gradient-secondary border-border">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p><strong>{player1Name}:</strong> Use W/S keys to move paddle up/down</p>
            <p><strong>{player2Name}:</strong> Use Arrow Up/Down keys to move paddle up/down</p>
            <p>First to {maxScore} points wins!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};