import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { toast } from "sonner";

export default function SocketListener() {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "notification") {
        toast(data.message);
      }
    };
  }, [socket]);

  return null;
}