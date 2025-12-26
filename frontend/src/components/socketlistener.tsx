import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function SocketListener() {
  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "tournament_match_started") {
        navigate("/loading?mode=2");
      }

      if (data.type === "notification") {
        toast(data.message);
      }
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
