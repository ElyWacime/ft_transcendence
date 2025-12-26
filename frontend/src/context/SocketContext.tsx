import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const SocketContext = createContext<WebSocket | null>(null);
export default function SocketProvider({ children }: { children: React.ReactNode }) {
  // const { user, token } = useAuth(); // adapt to your AuthContext
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const ws = new WebSocket(`ws://${import.meta.env.VITE_DOMAIN}:3000/ws`);
    setSocket(ws);
    ws.onopen = () => console.log("WebSocket connected 2");
    ws.onclose = () => console.log("WebSocket disconnected 2");
    return () => ws.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
