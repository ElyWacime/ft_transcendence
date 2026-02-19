import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { decodeJWT } from "@/lib/jwt-utils";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();

  const wsRef = useRef<WebSocket | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isReady, setIsReady] = useState(false);

  const token = localStorage.getItem("token");
  const id = token ? decodeJWT(token).id : null;

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.score1 >= 5 || data.score2 >= 5) {
        let message = "";

        if (data.score1 > data.score2) 
          message = data.P1_Id === id || data.P3_Id === id ? "You win the match!" : "You lost the match!";
        else 
          message = data.P2_Id === id || data.P4_Id === id ? "You win the match!" : "You lost the match!";

        toast[message.includes("win") ? "success" : "error"](message);

        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              token,
              type: "FINISHED",
              mode: data.mode,
              matchId: data.id,
            })
          );
        }

        console.log("Server Should end this >>>", data.id);
      }
      // console.log("Message:", data);
    },
    [id, token]
  );

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

    if (wsRef.current) return; // already connected

    const socket = new WebSocket(`ws://${import.meta.env.VITE_DOMAIN}:3000/ws`);
    wsRef.current = socket;
    setWs(socket);

    socket.onopen = () => setIsReady(true);
    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsReady(false);
      wsRef.current = null;
      setWs(null);
    };
    socket.onerror = (err) => console.log("WebSocket error:", err);

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
      socket.close();
      wsRef.current = null;
    };
  }, [isLoggedIn, handleMessage]);

  return <WebSocketContext.Provider value={{ ws, isReady }}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error("useWebSocket must be used inside WebSocketProvider");
  return context;
};