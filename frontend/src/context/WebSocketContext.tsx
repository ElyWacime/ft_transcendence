import { createContext, useContext, useEffect, useRef, useState } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const wsRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(`${wsProtocol}://${import.meta.env.VITE_DOMAIN}/game`);

    wsRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsReady(true);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsReady(false);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{ ws: wsRef.current, isReady }}
    >
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
