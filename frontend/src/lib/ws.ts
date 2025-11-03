import { useEffect, useRef, useState, useCallback } from 'react';

export type ServerState = any;

export function usePongServer(url: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [player, setPlayer] = useState<number | null>(null);
  const [state, setState] = useState<ServerState | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => {
      setConnected(false);
      setPlayer(null);
    };
    ws.onerror = () => {
      setConnected(false);
    };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'assign') {
          setPlayer(msg.player);
        } else if (msg.type === 'state') {
          setState(msg.state);
        } else if (msg.type === 'peer_left') {
          // mark disconnection
          setPlayer(null);
        }
      } catch (e) {
        // ignore
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [url]);

  const join = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'join' }));
    }
  }, []);

  const sendInput = useCallback((up: boolean, down: boolean) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'input', up, down }));
    }
  }, []);

  return { connected, player, state, join, sendInput };
}
