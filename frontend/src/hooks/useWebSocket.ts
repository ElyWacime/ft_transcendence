import { useEffect, useRef, useState } from "react";

export function useWebSocket(url: string) {
    const wsRef = useRef<WebSocket | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (wsRef.current) return;

        const ws = new WebSocket(url);
        wsRef.current = ws;

        const handleOpen = () => {
            console.log("ws Opened");
            setIsReady(true);
        };

        const handleClose = () => {
            console.log("ws handleClose");
            setIsReady(false);
        };

        ws.addEventListener("open", handleOpen);
        ws.addEventListener("close", handleClose);

        return () => {
            console.log("ws Closed");
            ws.removeEventListener("open", handleOpen);
            ws.removeEventListener("close", handleClose);
        };
    }, [url]);
    
    return { ws: wsRef.current, isReady };
}