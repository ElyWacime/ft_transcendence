import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { decodeJWT } from "@/lib/jwt-utils";
import { useLocation } from 'react-router-dom';

const WebSocketContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || window.location.origin;
const WS_URL = `${API_URL.replace(/^http/, "ws")}/ws`;




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
      // tournament notification for absent players
      // console.log("path", window.location.pathname );
      if (window.location.pathname !== "/tournament-online" && data?.waitingMatch) {
        // toast.info("you have a match waiting. Go to the arena to play.");
        toast.info("you have a match waiting in the tournament", {position:"top-right"});

      }
      // if (data?.waitingMatch) {
      //   // toast.info("Tournament: you have a match waiting. Go to the arena to play.");
      // toast.info("you have a match waiting in the tournament", {position:"top-right",color:"blue"});

      // }

      if (data.score1 >= 5 || data.score2 >= 5) {
        let message = "";
        let vs = "";
        if (data.score1 > data.score2) 
        {
          message = data.P1_Id === id || data.P3_Id === id ? "You win the match!" : "You lost the match!";
          if (data.P1_Id === id || data.P3_Id === id)
            vs =  " vs " + (data.player2Name || "PLAYER 2") + " " + (data.player4Name || "");
         else
            vs =  " vs " + (data.player1Name || "PLAYER 1") + " " + (data.player3Name || "");
        }
        else 
        {
          message = data.P2_Id === id || data.P4_Id === id ? "You win the match!" : "You lost the match!";
          if (data.P2_Id === id || data.P4_Id === id)
            vs =  " vs " + (data.player1Name || "PLAYER 1") + " " + (data.player3Name || "");
          else 
            vs =  " vs " + (data.player2Name  || "PLAYER 2")+ " " + (data.player4Name || "");
        }
        if (message.includes("win"))
          toast.success(message + vs);
        else
          toast.error(message + vs);
        // if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN)
        //   wsRef.current.send(JSON.stringify({ token, type: "FINISHED", mode: data.mode,  matchId: data.id}));
      }
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

    if (wsRef.current) return; 

    const socket = new WebSocket(WS_URL);
    wsRef.current = socket;
    setWs(socket);

    socket.onopen = () => 
    {
      setIsReady(true);
      // console.log("WebSocket connected");
    };
    socket.onclose = () => {
      // console.log("WebSocket disconnected");
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