import React, { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface PongCanvasOnlineProps {
  player1Name?: string;
  player2Name?: string;
  onGameEnd?: (player1Score: number, player2Score: number) => void;
  maxScore?: number;
  serverUrl?: string; // e.g. http://localhost:3001
  roomId?: string;
}

interface GameState {
  ball: { x: number; y: number; dx: number; dy: number; radius: number };
  paddle1: { x: number; y: number; width: number; height: number };
  paddle2: { x: number; y: number; width: number; height: number };
  score: { player1: number; player2: number };
  gameStatus: 'waiting' | 'playing' | 'paused' | 'finished';
}

export const PongCanvasOnline: React.FC<PongCanvasOnlineProps> = ({
  player1Name = 'Player 1',
  player2Name = 'Player 2',
  onGameEnd,
  maxScore = 5,
  serverUrl = 'http://localhost:3001',
  roomId
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const keysPressed = useRef<Set<string>>(new Set());
  const socketRef = useRef<Socket | null>(null);
  const playerIdRef = useRef<number | null>(null);

  const [gameState, setGameState] = useState<GameState>({
    ball: { x: 400, y: 300, dx: 1.5, dy: 0.5, radius: 8 },
    paddle1: { x: 20, y: 250, width: 15, height: 100 },
    paddle2: { x: 765, y: 250, width: 15, height: 100 },
    score: { player1: 0, player2: 0 },
    gameStatus: 'waiting'
  });

  const BALL_SPEED = 0.9; // visual/legacy value kept for local prediction

  // Connect to server and wire events
  useEffect(() => {
    const socket = io(serverUrl);
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join', { roomId });
    });

    socket.on('joined', (data: any) => {
      if (data?.playerId !== undefined) playerIdRef.current = data.playerId;
    });

    socket.on('state', (payload: any) => {
      setGameState(prev => ({
        ...prev,
        paddle1: { ...prev.paddle1, y: payload.players?.[0]?.y ?? prev.paddle1.y },
        paddle2: { ...prev.paddle2, y: payload.players?.[1]?.y ?? prev.paddle2.y },
        ball: { x: payload.ball.x, y: payload.ball.y, dx: payload.ball.vx ?? prev.ball.dx, dy: payload.ball.vy ?? prev.ball.dy, radius: payload.ball.radius ?? prev.ball.radius },
        score: { player1: payload.score?.[0] ?? prev.score.player1, player2: payload.score?.[1] ?? prev.score.player2 },
        gameStatus: 'playing'
      }));
    });

    socket.on('disconnect', () => {
      playerIdRef.current = null;
    });

    return () => {
      try { socket.disconnect(); } catch (e) { /* ignore */ }
      socketRef.current = null;
    };
  }, [serverUrl, roomId]);

  // keyboard handling + emit inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      keysPressed.current.add(e.code);
      const myId = playerIdRef.current;
      if (socketRef.current && myId !== null) {
        const up = myId === 0 ? keysPressed.current.has('KeyW') : keysPressed.current.has('ArrowUp');
        const down = myId === 0 ? keysPressed.current.has('KeyS') : keysPressed.current.has('ArrowDown');
        socketRef.current.emit('input', { up, down });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
      const myId = playerIdRef.current;
      if (socketRef.current && myId !== null) {
        const up = myId === 0 ? keysPressed.current.has('KeyW') : keysPressed.current.has('ArrowUp');
        const down = myId === 0 ? keysPressed.current.has('KeyS') : keysPressed.current.has('ArrowDown');
        socketRef.current.emit('input', { up, down });
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // simple renderer -- draw according to latest server state
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = 'hsl(222 47% 4%)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle = 'hsl(222 47% 12%)';
    ctx.setLineDash([10,10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2,0);
    ctx.lineTo(canvas.width/2,canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'hsl(217 91% 60%)';
    ctx.fillRect(gameState.paddle1.x, gameState.paddle1.y, gameState.paddle1.width, gameState.paddle1.height);
    ctx.fillRect(gameState.paddle2.x, gameState.paddle2.y, gameState.paddle2.width, gameState.paddle2.height);

    ctx.beginPath();
    ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI*2);
    ctx.fillStyle = 'hsl(217 91% 60%)';
    ctx.fill();

    ctx.shadowColor = 'hsl(217 91% 60%)';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'hsl(210 40% 98%)';
    ctx.font = '48px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(gameState.score.player1.toString(), canvas.width/4, 60);
    ctx.fillText(gameState.score.player2.toString(), (canvas.width*3)/4, 60);
  }, [gameState]);

  // animation loop
  useEffect(() => {
    const loop = () => {
      draw();
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    };
  }, [draw]);

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <canvas ref={canvasRef} width={800} height={600} className="border border-border rounded-lg bg-card" />
      </div>
      <div className="flex justify-between max-w-3xl mx-auto">
        <div className="text-center">
          <div className="text-3xl font-game font-bold text-primary">{gameState.score.player1}</div>
          <div className="text-sm text-muted-foreground">W / S</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-game font-bold text-primary">{gameState.score.player2}</div>
          <div className="text-sm text-muted-foreground">↑ / ↓</div>
        </div>
      </div>
    </div>
  );
};

export default PongCanvasOnline;