import { useEffect, useRef, useState } from "react";

export default function WebSocketClient() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const wsRef = useRef(null);

    useEffect(() => {
        // Connect once
        wsRef.current = new WebSocket("ws://localhost:3000/ws");

        wsRef.current.onopen = () => {
            console.log("Connected to WebSocket server");
        };

        wsRef.current.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data]);
        };

        wsRef.current.onclose = () => {
            console.log("Disconnected from server");
        };

        return () => {
            wsRef.current.close();
        };
    }, []);

    const sendMessage = () => {
        if (input.trim() === "") return;

        wsRef.current.send(input);
        setInput("");
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Fastify WebSocket Demo (React)</h1>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
            />

            <button onClick={sendMessage}>Send</button>

            <ul>
                {messages.map((m, i) => (
                    <li key={i}>{m}</li>
                ))}
            </ul>
        </div>
    );
}
