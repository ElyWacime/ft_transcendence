import React, { useRef, useState, useEffect, useCallback } from "react";
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

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

interface GameState {
  ball: Ball;
  paddle1: Paddle;
  paddle2: Paddle;
  paddle3: Paddle;
  paddle4: Paddle;
  score: { player1: number; player2: number };
  gameStatus: "waiting" | "playing" | "paused" | "FINISHED";
}

const BALL_SPEED = 5;
const paddleSpeed = 10;
const accelerateSpeed = 1.2;
const max_Speed = 25;
const angle = Math.PI / 8;

export const PongCanvas = ({
  player2Name =  "Player 2",
  player1Name = localStorage.getItem("email") || "Player 1",
  player3Name = "Player 3",
  player4Name = "Player 4",
  onGameEnd,
  maxScore = 5,
}: PongCanvasProps) => {
  const animationRef = useRef<number>(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const lastTimeRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState | null>(null);

  const [gameState, setGameState] = useState<GameState>({
    ball: {
      x: 400,
      y: 300,
      dx: BALL_SPEED * Math.cos(angle),
      dy: BALL_SPEED * Math.sin(angle),
      radius: 8,
    },
    paddle1: { x: 20, y: 250, width: 15, height: 100 },
    paddle2: { x: 765, y: 250, width: 15, height: 100 },
    paddle3: { x: 60, y: 250, width: 15, height: 100 },
    paddle4: { x: 725, y: 250, width: 15, height: 100 },
    score: { player1: 0, player2: 0 },
    gameStatus: "waiting",

  });

  const createBall = useCallback(
    (dirx: number = 1) => ({
      x: 400,
      y: 300,
      dx: dirx * BALL_SPEED * Math.cos(angle),
      dy: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED * Math.sin(angle),
      radius: 8,
    }),
    []
  );

  const resetGame = useCallback(() => {
    lastTimeRef.current = null;
    setGameState((prev) => ({
      ...prev,
      ball: createBall(1),
      paddle1: { ...prev.paddle1, y: 250 },
      paddle2: { ...prev.paddle2, y: 250 },
      paddle3: { ...prev.paddle3, y: 250 },
      paddle4: { ...prev.paddle4, y: 250 },
      score: { player1: 0, player2: 0 },
      gameStatus: "waiting",
    }));
  }, [createBall]);

  const draw = useCallback((state: GameState) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.fillStyle = "hsl(222 47% 4%)";
    // Clear
    ctx.fillStyle = "hsl(222 47% 4%)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Center line
    ctx.strokeStyle = "hsl(222 47% 12%)";
    // Center line
    ctx.strokeStyle = "hsl(222 47% 12%)";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Paddles
    ctx.fillStyle = "hsl(217 91% 60%)";
    ctx.fillRect(state.paddle1.x, state.paddle1.y, state.paddle1.width, state.paddle1.height);
    ctx.fillRect(state.paddle2.x, state.paddle2.y, state.paddle2.width, state.paddle2.height);

    // Ball
    // Ball
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "hsl(217 91% 60%)";
    ctx.fill();

    ctx.shadowColor = "hsl(217 91% 60%)";
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Scores
    ctx.fillStyle = "hsl(210 40% 98%)";
    ctx.font = '48px "JetBrains Mono"';
    ctx.textAlign = "center";
    ctx.fillText(state.score.player1.toString(), canvas.width / 4, 60);
    ctx.fillText(state.score.player2.toString(), (canvas.width * 3) / 4, 60);
  }, []);

  // ADDED FROM SECOND FILE: AI state mapping
  const mapGameStateToAI = useCallback(
    (state: GameState, canvasHeight: number): AIGameState => ({
      ball: {
        x: state.ball.x,
        y: state.ball.y,
        velocityX: state.ball.dx,
        velocityY: state.ball.dy,
        radius: state.ball.radius
      },
      aiPaddle: {
        x: state.paddle2.x,
        y: state.paddle2.y,
        width: state.paddle2.width,
        height: state.paddle2.height
      },
      playerPaddle: {
        x: state.paddle1.x,
        y: state.paddle1.y,
        width: state.paddle1.width,
        height: state.paddle1.height
      },
      gameHeight: canvasHeight
    }),
    []
  );

  // MODIFIED updateGame to include AI from second file
  const updateGame = useCallback(
    (delta: number) => {
      setGameState((prev) => {
        if (prev.gameStatus !== "playing") return prev;
        const newState = { ...JSON.parse(JSON.stringify(prev)) } as GameState;
        const canvas = canvasRef.current;
        if (!canvas) return prev;

        // Get AI action if enabled

        // Paddle 1 (W/S) - unchanged
        if (keysPressed.current.has("KeyW") && newState.paddle1.y > 0)
          newState.paddle1.y -= paddleSpeed * delta;
        if (keysPressed.current.has("KeyS") && newState.paddle1.y < canvas.height - newState.paddle1.height)
          newState.paddle1.y += paddleSpeed * delta;
        if (keysPressed.current.has("ArrowUp") && newState.paddle2.y > 0)
            newState.paddle2.y -= paddleSpeed * delta;
        if (keysPressed.current.has("ArrowDown") && newState.paddle2.y < canvas.height - newState.paddle2.height)
          newState.paddle2.y += paddleSpeed * delta;
        

        // Ball movement - unchanged
        newState.ball.x += newState.ball.dx * delta;
        newState.ball.y += newState.ball.dy * delta;

        // Collision with top/bottom - unchanged
        if (newState.ball.y + newState.ball.radius >= canvas.height) {
          newState.ball.dy = -newState.ball.dy;
          newState.ball.y = canvas.height - newState.ball.radius;
        } else if (newState.ball.y - newState.ball.radius <= 0) {
          newState.ball.dy = -newState.ball.dy;
          newState.ball.y = newState.ball.radius;
        }

        // Paddle collisions (simple 2-player) - unchanged
        const ball = newState.ball;
        const p1 = newState.paddle1;
        const p2 = newState.paddle2;

        if (
          ball.x - ball.radius <= p1.x + p1.width &&
          ball.x - ball.radius >= p1.x &&
          ball.y + ball.radius >= p1.y &&
          ball.y - ball.radius <= p1.y + p1.height &&
          ball.dx < 0
        ) {
          ball.x = p1.x + p1.width + ball.radius;
          ball.dx = -ball.dx;
          // Accelerate
          if (newState.ball.dx * newState.ball.dx + newState.ball.dy * newState.ball.dy < max_Speed * max_Speed) {
            newState.ball.dx *= accelerateSpeed;
            newState.ball.dy *= accelerateSpeed;
          }
        }

        if (
          ball.x + ball.radius >= p2.x &&
          ball.x + ball.radius <= p2.x + p2.width &&
          ball.y + ball.radius >= p2.y &&
          ball.y - ball.radius <= p2.y + p2.height &&
          ball.dx > 0
        ) {
          ball.x = p2.x - ball.radius;
          ball.dx = -ball.dx;
          // Accelerate
          if (newState.ball.dx * newState.ball.dx + newState.ball.dy * newState.ball.dy < max_Speed * max_Speed) {
            newState.ball.dx *= accelerateSpeed;
            newState.ball.dy *= accelerateSpeed;
          }
        }

        // Scoring - unchanged
        if (ball.x < 0) {
          newState.score.player2++;
          newState.ball = createBall(-1);
        } else if (ball.x > canvas.width) {
          newState.score.player1++;
          newState.ball = createBall(1);
        }

        // Check end - unchanged
        if (newState.score.player1 >= maxScore || newState.score.player2 >= maxScore) {
          newState.gameStatus = "FINISHED";
          onGameEnd?.(newState.score.player1, newState.score.player2);
        }

        // ADDED: Update ref
        gameStateRef.current = newState;
        return newState;
      });
    },
    [createBall, maxScore, onGameEnd]
  );

  // MODIFIED useEffect to add AI initialization and proper cleanup
  useEffect(() => {

    // Keyboard event handlers - unchanged
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable) return;
      }
      if (["KeyW", "KeyS", "ArrowUp", "ArrowDown"].includes(e.code)) {
        keysPressed.current.add(e.code);
        // prevent default scroll behavior for arrows
        if (gameState.gameStatus === "playing" && (e.code === "ArrowUp" || e.code === "ArrowDown"))
          e.preventDefault();
      }
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable) return;
      }
      if (["KeyW", "KeyS", "ArrowUp", "ArrowDown"].includes(e.code)) {
        keysPressed.current.add(e.code);
        // prevent default scroll behavior for arrows
        if (gameState.gameStatus === "playing" && (e.code === "ArrowUp" || e.code === "ArrowDown"))
          e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp);

    // Game / render loop - unchanged
    const loop = (time: number) => {
      const last = lastTimeRef.current;
      const delta = last !== null ? (time - last) / 16.67 : 1;
      lastTimeRef.current = time;

      updateGame(delta);
      draw(gameState);

      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);

    // Cleanup on unmount - MODIFIED to clean up AI
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationRef.current);
    };
  }, [gameState, updateGame, draw]);

  const startGame = () => {
    lastTimeRef.current = null;
    setGameState((prev) => ({ ...prev, gameStatus: "playing" }));
    lastTimeRef.current = null;
    setGameState((prev) => ({ ...prev, gameStatus: "playing" }));
  };

  const pauseGame = () => {
    setGameState((prev) => ({ ...prev, gameStatus: "paused" }));
    setGameState((prev) => ({ ...prev, gameStatus: "paused" }));
  };

  const resumeGame = () => {
    lastTimeRef.current = null;
    setGameState((prev) => ({ ...prev, gameStatus: "playing" }));
    lastTimeRef.current = null;
    setGameState((prev) => ({ ...prev, gameStatus: "playing" }));
  };


  return (
    <div className="pong-game-interface">
      <div className="player-controls-grid">
        <Card className="player-card player1-card">
          <CardHeader className="player-card-header">
            <CardTitle className="player-card-title">{player1Name}</CardTitle>
          </CardHeader>
          <CardContent className="player-card-content">
            <div className="player-score player1-score">
              {gameState.score.player1}
            </div>
            <div className="player-control-hint">W/S Keys</div>
          </CardContent>
        </Card>
  
        <div className="game-controls-center">
          <div className="game-controls-buttons">
            {gameState.gameStatus === "waiting" && (
              <Button onClick={startGame} className="game-control-button start-button">
                <Play className="button-icon" />
                Start Game
              </Button>
            )}
            {gameState.gameStatus === "playing" && (
              <Button onClick={pauseGame} className="game-control-button pause-button">
                <Pause className="button-icon" />
                Pause
              </Button>
            )}
            {gameState.gameStatus === "paused" && (
              <Button onClick={resumeGame} className="game-control-button resume-button">
                <Play className="button-icon" />
                Resume
              </Button>
            )}
            <div className="additional-controls">
              <Button onClick={resetGame} className="reset-button-small">
                <RotateCcw className="button-icon" />
                Reset
              </Button>
            </div>
          </div>
        </div>
  
        <Card className="player-card player2-card">
          <CardHeader className="player-card-header">
            <CardTitle className="player-card-title">{player2Name}</CardTitle>
          </CardHeader>
          <CardContent className="player-card-content">
            <div className="player-score player2-score">
              {gameState.score.player2}
            </div>
            <div className="player-control-hint">
            </div>
          </CardContent>
        </Card>
      </div>
  
      <div className="game-canvas-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          tabIndex={0}
          className="game-canvas"
        />
      </div>
    </div>
  );
};