import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();

  const wsRef = useRef(null);
  const [ws, setWs] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {

    if (!isLoggedIn) {
      if (wsRef.current) {
        console.log("Closing WS because user logged out");
        wsRef.current.close();
        wsRef.current = null;
        setWs(null);
        setIsReady(false);
      }
      return;
    }
    const socket = new WebSocket(`ws://${import.meta.env.VITE_DOMAIN}:3000/ws`);

    wsRef.current = socket;
    setWs(socket);

    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsReady(true);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsReady(false);
    };

    return () => socket.close();

  }, [isLoggedIn]);

  return (
    <WebSocketContext.Provider value={{ ws, isReady }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used inside WebSocketProvider");
  }
  return context;
};
