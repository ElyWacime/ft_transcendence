import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { isLoggedIn, isLoading, accessToken, user } = useAuth();

  const wsRef = useRef<WebSocket | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isReady, setIsReady] = useState(false);

  const token = accessToken;
  const id = user?.id || null;

  const handleMessage = useCallback(
    (event: MessageEvent) => {

      const data = JSON.parse(event.data);
      if (window.location.pathname !== "/online-tournaments" && data?.waitingMatch) {
        toast.info("you have a match waiting in the tournament", {position:"top-right"});
      }
      if (data.score1 >= 5 || data.score2 >= 5) {
        let message = "";
        if (data.score1 > data.score2) 
          message = data.P1_Id === id || data.P3_Id === id ? "You win the match!" : "You lost the match!";
        else 
          message = data.P2_Id === id || data.P4_Id === id ? "You win the match!" : "You lost the match!";
        if (message.includes("win"))
          toast.success(message);
        else
          toast.error(message);
      }
    },
    [id, token]
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isLoggedIn) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
        setWs(null);
        setIsReady(false);
      }
      return;
    }

    if (wsRef.current) return; 

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = import.meta.env.VITE_DOMAIN || window.location.host;
    const socket = new WebSocket(`${protocol}//${host}/ws`);
    wsRef.current = socket;
    setWs(socket);

    socket.onopen = () => 
    {

      
      setIsReady(true);
      console.log("WebSocket Created:");
      if (socket && socket.readyState === WebSocket.OPEN) 
          socket.send(JSON.stringify({ type: "PING" ,token:accessToken}));
    };
    socket.onclose = () => {
      setIsReady(false);
      console.log("WebSocket Closed:");
      wsRef.current = null;
      setWs(null);
    };
    socket.onerror = (err) => {

      console.log("WebSocket error:", err);
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
      socket.close();
      wsRef.current = null;
    };
  }, [isLoggedIn, isLoading, handleMessage]);


  useEffect(() => {
    const interval = setInterval(() => {
      const socket = wsRef.current;
      if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "PING" ,token:accessToken}));
      }
    }, 25000);

    return () => clearInterval(interval);
  }, [accessToken]);

  return <WebSocketContext.Provider value={{ ws, isReady, wsRef }}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error("useWebSocket must be used inside WebSocketProvider");
  return context;
};