

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const SocketContext = createContext<WebSocket | null>(null);
export default function SocketProvider({ children }: { children: React.ReactNode }) {
  let token = localStorage.getItem("token");
  // const { user, token } = useAuth(); // adapt to your AuthContext
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const ws = new WebSocket(`ws://${import.meta.env.VITE_DOMAIN}:3000/ws?token=${token}`);
    setSocket(ws);

    const handleOpen = () => {
      console.log("WebSocket connected 4");
      if (!ws || ws.readyState != WebSocket.OPEN)
        return;
      ws.send(JSON.stringify({ type: "AUTHENTICATE", token }) );
    };
    const handleClose = () => {
      console.log(" 44444 WebSocket closed");
    };
    ws.addEventListener("open", handleOpen);
    ws.addEventListener("close", handleClose);
    ws.addEventListener("error", (err) => console.error("WS error:", err));
    
    return () => {
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("close", handleClose);
      // ws.close();
    };
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

// import { createContext, useContext, useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";



// const SocketContext = createContext<WebSocket | null>(null);
// export default function SocketProvider({ children }: { children: React.ReactNode }) {
//   let token = localStorage.getItem("token");
//   // const { user, token } = useAuth(); // adapt to your AuthContext
//   const [socket, setSocket] = useState<WebSocket | null>(null);
//   useEffect(() => {
//     const ws = new WebSocket(`ws://${import.meta.env.VITE_DOMAIN}:3000/ws?token=${token}`);
//     setSocket(ws);
//     ws.onopen = () => {
//       console.log("WebSocket connected 2")
//       ws.send(JSON.stringify({ type: "AUTHENTICATE", token }) );
//     };
   
//     ws.onmessage = () => {
//       console.log("WebSocket connected 2")
//       ws.send(JSON.stringify({ type: "AUTHENTICATE", token }) );
//     };
//     ws.onclose = () => console.log("WebSocket disconnected 2");
//     // return () => ws.close();
//   }, []);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// }

// export function useSocket() {
//   return useContext(SocketContext);
// }

