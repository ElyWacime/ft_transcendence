import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function SocketListener() {
  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log("server saus 2=== ", data);
      console.log("Received WebSocket message:", data);
      if (data.type == "redirect") {
            toast("Navigate to Play");
              navigate("/loading?mode=2");
            }
          };
    socket.addEventListener("message", handleMessage);
    return () => {
      // socket.removeEventListener("message", handleMessage);
      // if(socket.readyState === WebSocket.OPEN) {
      //   socket.close();
      // }
    };
  }, [socket]);

  return null;
}

// export default function SocketListener() {
//   const socket = useSocket();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!socket) return;

//     const handleMessage = (event) => {
//       const data = JSON.parse(event.data);

//       if (data.type === "tournament_match_started") {
//         navigate("/loading?mode=2");
//       }

//       if (data.type === "notification") {
//         toast(data.message);
//       }
//     };

//     socket.addEventListener("message", handleMessage);

//     // ✅ cleanup to prevent memory leaks
//     return () => {
//       socket.removeEventListener("message", handleMessage);
//     };
//   }, [socket, navigate]);

//   return null;
// }
