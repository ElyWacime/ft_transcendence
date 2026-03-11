import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { useWebSocket } from "@/context/WebSocketContext";
import { useAuth } from "@/context/AuthContext";
import { fetchWithAuth } from "@/lib/tokenRefresh";

const MatchMacking = () => {
    const { ws, isReady } = useWebSocket();
 
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get("mode");
    const del = useRef(true);
    const matchref = useRef(null);
    const messageHandlerRef = useRef(null);
    const gameStarted = useRef(false); // Track if game has started
    const processedMessageIds = useRef(new Set()); // Track processed message IDs
    const nameCache = useRef(new Map()); // Cache for player names
    
    // Use state for player names
    const [playerNames, setPlayerNames] = useState({
        p1: null,
        p2: null,
        p3: null,
        p4: null
    });
    
    const [features, setFeatures] = useState([]);

    const { accessToken, updateAccessToken } = useAuth();
    
    const getName = useCallback(async (id: number) => {
        if (!id) return null;
        
        // Check cache first
        if (nameCache.current.has(id)) {
            return nameCache.current.get(id);
        }
        
        try {
            let res = await fetchWithAuth(`/api/users/get-user/${id}`, { method: "GET" }, accessToken, updateAccessToken);
            if (res.status === 200) {
                let data = await res.json();
                // Store in cache
                nameCache.current.set(id, data.name);
                return data.name;
            } else {
                console.error(`Failed to fetch name for id ${id}: ${res.statusText}`);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching name for id ${id}:`, error);
            return null;
        }
    }, [accessToken, updateAccessToken]);

    // Create the message handler
    const handleMessage = useCallback(async (event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data);
            
            // Skip if game has already started
            if (gameStarted.current) {
                console.log("Game already started, skipping message");
                return;
            }
            
            // Check if we've already processed this message (by ID and timestamp)
            const messageId = `${data.id}-${data.now}`;
            if (processedMessageIds.current.has(messageId)) {
                console.log("Duplicate message, skipping");
                return;
            }
            processedMessageIds.current.add(messageId);
            
            // Limit the size of the processed messages set
            if (processedMessageIds.current.size > 100) {
                const iterator = processedMessageIds.current.values();
                for (let i = 0; i < 50; i++) {
                    processedMessageIds.current.delete(iterator.next().value);
                }
            }
            
            console.log("Processing message:", data);
            matchref.current = data.id;
            
            // Check if game is already playing
            if (data.gameStatus === "PLAYING") {
                gameStarted.current = true;
                
                // Get names from cache or fetch them
                const [name1, name2, name3, name4] = await Promise.all([
                    getName(data.P1_Id),
                    getName(data.P2_Id),
                    getName(data.P3_Id),
                    getName(data.P4_Id)
                ]);
                
                del.current = false;
                navigate("/game-online", {
                    state: {
                        player1Name: name1,
                        player2Name: name2,
                        player3Name: name3,
                        player4Name: name4,
                        mode
                    },
                });
                return;
            }
            
            // Only fetch names if we don't have them yet or if they've changed
            const needsUpdate = 
                (data.P1_Id && !playerNames.p1) ||
                (data.P2_Id && !playerNames.p2) ||
                (data.P3_Id && !playerNames.p3) ||
                (data.P4_Id && !playerNames.p4);
            
            if (needsUpdate) {
                // Fetch all player names at once
                const [name1, name2, name3, name4] = await Promise.all([
                    getName(data.P1_Id),
                    getName(data.P2_Id),
                    getName(data.P3_Id),
                    getName(data.P4_Id)
                ]);
                
                // Update all player names
                setPlayerNames({
                    p1: name1,
                    p2: name2,
                    p3: name3,
                    p4: name4
                });
            }
            
            // Update features for waiting room display
            if (mode === "4") {
                setFeatures([
                    {
                        icon: Users,
                        title: playerNames.p1 || "Player1",
                        description: data.P1_Id ? "ready" : "waiting",
                        color: "feature-icon-container-color-red"
                    },
                    {
                        icon: Users,
                        title: playerNames.p2 || "Player2",
                        description: data.P2_Id ? "ready" : "waiting",
                        color: "feature-icon-container"
                    },
                    {
                        icon: Users,
                        title: playerNames.p3 || "Player3",
                        description: data.P3_Id ? "ready" : "waiting",
                        color: "feature-icon-container-color-red"
                    },
                    {
                        icon: Users,
                        title: playerNames.p4 || "Player4",
                        description: data.P4_Id ? "ready" : "waiting",
                        color: "feature-icon-container"
                    },
                ]);
            } else {
                setFeatures([
                    {
                        icon: Users,
                        title: playerNames.p1 || "Player1",
                        description: data.P1_Id ? "ready" : "waiting",
                        color: "feature-icon-container"
                    },
                    {
                        icon: Users,
                        title: playerNames.p2 || "Player2",
                        description: data.P2_Id ? "ready" : "waiting",
                        color: "feature-icon-container"
                    }
                ]);
            }
        } catch (error) {
            console.error("Error handling message:", error);
        }
    }, [mode, navigate, getName, playerNames]);

    // Store the handler in a ref to maintain stable reference
    useEffect(() => {
        messageHandlerRef.current = handleMessage;
    }, [handleMessage]);

    useEffect(() => {
        if (!ws || !isReady || ws.readyState !== WebSocket.OPEN) return;

        console.log("Setting up WebSocket listener");
        
        // Use the handler from ref to ensure stable reference
        const handler = (event: MessageEvent) => {
            messageHandlerRef.current(event);
        };

        ws.send(JSON.stringify({
            token: accessToken,
            type: "REGISTER",
            mode,
        }));
        
        ws.addEventListener("message", handler);
        
        // Cleanup function
        return () => {
            console.log("Cleaning up WebSocket listener");
            
            // Remove the event listener first
            ws.removeEventListener("message", handler);
            
            // Send DELETE message if needed (only if game hasn't started)
            if (del.current && !gameStarted.current && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    token: accessToken,
                    type: "DELETE",
                    matchId: matchref.current
                }));
            }
            
            // Reset refs
            del.current = true;
            matchref.current = null;
            gameStarted.current = false;
            processedMessageIds.current.clear();
            // Note: we don't clear nameCache to preserve it for potential future use
        };
    }, [ws, isReady, accessToken, mode]);

    return (
        <>
            <div className="home-page">
                <section className="hero-section">
                    <div className="hero-glow-overlay"></div>
                    <div className="hero-content">
                        <h1 className="hero-title glow-text animate-float">
                            PONG
                            <span className="text-primary"> ARENA</span>
                        </h1>
                        <p className="hero-subtitle">
                            Play against players online!
                        </p>
                    </div>
                </section>
                <section className="features-section">
                    <div className="features-container">
                        <h2 className="features-title glow-text">
                            Game's Waiting Room
                        </h2>
                        <div className="features-grid">
                            {features.map((feature, index) => (
                                <Card
                                    key={index}
                                    className="feature-card2"
                                >
                                    <div className="feature-card-content">
                                        <div className={feature.color}>
                                            <feature.icon className="feature-icon" />
                                        </div>
                                        <h3 className="feature-card-title2">{feature.title}</h3>
                                        <p className={feature.description === "ready" ? "stateGmae-g" : "stateGmae-r"}>
                                            {feature.description}
                                        </p>
                                        {mode === "4" && (
                                            <p className={index % 2 === 0 ? "stateGmae-A" : "stateGmae-B"}>
                                                {index % 2 === 0 ? "Team A" : "Team B"}
                                            </p>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default MatchMacking;