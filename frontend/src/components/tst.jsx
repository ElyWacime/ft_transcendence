import React, { useState, useEffect, useRef } from "react";

function WebSocketChat() {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const wsRef = useRef(null);

    useEffect(() => {
        // Connect to Fastify WebSocket server
        wsRef.current = new WebSocket("ws://localhost:3000/ws");

        wsRef.current.addEventListener("open", () => {
            console.log("Connected to WebSocket server");
        });

        wsRef.current.addEventListener("message", (event) => {
            setMessages((prev) => [...prev, event.data]);
        });

        wsRef.current.addEventListener("close", () => {
            console.log("Disconnected from server");
        });

        // Cleanup on unmount
        return () => {
            wsRef.current.close();
        };

    }, []);

    const sendMessage = () => {
        if (input.trim() === "") return;
        wsRef.current.send(input);
        setInput("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "2rem auto", textAlign: "center" }}> <h1>Fastify WebSocket Chat</h1> <div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message"
                style={{ width: "70%", padding: "0.5rem" }}
            />
            <button onClick={sendMessage} style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}>
                Send </button> </div>
            <ul style={{ textAlign: "left", marginTop: "1rem", maxHeight: "300px", overflowY: "auto" }}>
                {messages.map((msg, idx) => (
                    <li key={idx} style={{ padding: "0.2rem 0" }}>{msg}</li>
                ))} </ul> </div>
    );

}

export default WebSocketChat;
