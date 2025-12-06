import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Gamepad2, Zap } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useWebSocket } from "../hooks/useWebSocket";
import { useEffect, useState } from "react";

const MatchMacking = () => {
    const { ws, send, isReady } = useWebSocket("ws://localhost:3000/ws");
    let keys = { ArrowUp: false, ArrowDown: false };
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [role, setRole] = useState<boolean>(true);
    const mode = searchParams.get("mode"); // "4"
    const email = localStorage.getItem("email");
    const [features, setFeatures] = useState(() => {
        // Initial state based on mode and email
        return [
            {
                icon: Users,
                title: email,
                description: mode === "4" ? "Team A" : "Player 1",
            },
            {
                icon: Users,
                title: "Player 2",
                description: mode === "4" ? "Team B" : "Player 2",
            },
            ...(mode === "4"
                ? [
                    {
                        icon: Users,
                        title: "Player 3",
                        description: "Team A",
                    },
                    {
                        icon: Users,
                        title: "Player 4",
                        description: "Team B",
                    },
                ]
                : []),
        ];
    });

    // const SubscribeToGame = () => {
    //     ws.send(JSON.stringify({
    //         type: "REGISTER",
    //         email: email,
    //         tournement: false,
    //         keys,
    //         mode: mode,
    //         id: localStorage.getItem("email")
    //     }));
    // };
    useEffect(() => {
        if (!ws || !isReady) return;

        console.log("MOUNT >>>>>");

        // 1. Register on mount
        ws.send(JSON.stringify({
            type: "REGISTER",
            email,
            tournement: false,
            keys,
            mode,
            id: email,
        }));

        // 2. Handle messages
        const handleMessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);

            let vs = data.player2Name;
            if (vs === email) vs = data.player1Name;

            setFeatures(prev =>
                prev.map(f =>
                    f.title === "Player 2"
                        ? { ...f, title: vs || "Player 2" }
                        : f
                )
            );

            if (data.count_players == mode) {
                navigate("/game-online", {
                    state: {
                        player1Name: data.player1Name,
                        player2Name: data.player2Name,
                        mode,
                    },
                });
            }
        };

        ws.addEventListener("message", handleMessage);

        // 3. Cleanup on unmount
        return () => {
            console.log("UNMOUNT >>>>>");

            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: "DELETE",
                    email,
                    tournement: false,
                    keys,
                    mode,
                    id: email,
                }));
            }

            ws.removeEventListener("message", handleMessage);

            // Close after sending DELETE
            ws.close();
        };
    }, [ws, isReady]);

    // useEffect(() => {
    //     if (!ws)
    //         return;
    //     SubscribeToGame();
    //     return () => {
    //         ws.close();
    //     };
    // }, [isReady, ws]);

    // useEffect(() => {
    //     console.log("MOUNT >>>>> ");
    //     return () => {
    //         console.log("UNMOUNT >>>>> ");
    //         if (ws)
    //             ws.send(JSON.stringify({
    //                 type: "DELETE",
    //                 email: email,
    //                 tournement: false,
    //                 keys,
    //                 mode: mode,
    //                 id: localStorage.getItem("email")
    //             }));

    //     };
    // }, []);

    // useEffect(() => {
    //     if (!ws) return;
    //     const handleMessage = (event: MessageEvent) => {
    //         const data = JSON.parse(event.data);
    //         let vs = data.player2Name;
    //         if (vs == email)
    //             vs = data.player1Name;
    //         setFeatures((prev) =>
    //             prev.map((f) =>
    //                 f.title === "Player 2" ? { ...f, title: vs || "Player 2" } : f
    //             )
    //         );
    //         if (data.count_players == mode)
    //             navigate("/game-online", {
    //                 state: {
    //                     player1Name: data.player1Name,
    //                     player2Name: data.player2Name,
    //                     mode: mode
    //                 }
    //             });
    //     };
    //     ws.addEventListener("message", handleMessage);
    //     return () => {
    //         console.log("Return >>>>> ");
    //         if (ws)
    //             ws.send(JSON.stringify({
    //                 type: "DELETE2",
    //                 email: email,
    //                 tournement: false,
    //                 keys,
    //                 mode: mode,
    //                 id: localStorage.getItem("email")
    //             }));
    //         ws.removeEventListener("message", handleMessage);
    //     };
    // }, [ws]);

    return (
        <>
            {<div className="min-h-screen pt-16">
                {/* Hero Section */}
                <section className="relative py-20 px-4 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-glow opacity-30"></div>
                    <div className="relative z-10 max-w-4xl mx-auto">
                        <h1 className="text-6xl md:text-8xl font-game font-bold mb-6 glow-text animate-float">
                            PONG
                            <span className="text-primary"> ARENA</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Play against players online!
                        </p>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20 px-">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-game font-bold text-center mb-12 glow-text">
                            Game Features
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                < Card
                                    key={index}
                                    className="p-6 bg-gradient-secondary border-border hover:border-primary transition-all duration-300 hover:shadow-glow group"
                                >
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <feature.icon className="w-6 h-6 text-primary-foreground" />
                                        </div>
                                        <h3 className="font-semibold text-lg">{feature.title}</h3>
                                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section >
            </div >}
        </>
    );
};

export default MatchMacking;
