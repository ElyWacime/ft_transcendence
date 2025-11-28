import { useEffect, useRef, useState } from "react";

export function useWebSocket(url: string) {
    const wsRef = useRef<WebSocket | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (wsRef.current) return;

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("Parent WebSocket connected");
            setIsReady(true);
        };

        ws.onclose = () => {
            console.log("Parent WebSocket closed");
            setIsReady(false);
        };

        ws.onerror = (err) => {
            console.error("Parent WebSocket error:", err);
        };

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [url]);

    const send = (data: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data));
        }
    };

    return { ws: wsRef.current, send, isReady };
}
