
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import { Trophy, Github } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
// import { PrismaClient } from "../../../services/auth-service/src/generated/prisma";
// const prisma = new PrismaClient();
// const user = await prisma.user.findUnique({ where: { email: localStorage.getItem("email") } });
const Profile = () => {
    const [loading, setLoading] = useState(false);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-secondary text-center px-4">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-4xl md:text-6xl font-game font-bold glow-text flex items-center justify-center space-x-3">

                    {/* <span>{user.name}</span> */}
                </h1>
                <p className="text-muted-foreground mt-2 text-sm md:text-base">
                    Online/Offline  🕹️
                </p>
            </div>
            <div className="mb-10">
                <h1 className="text-4xl md:text-6xl font-game font-bold glow-text flex items-center justify-center space-x-3">
                    <span>Picture</span>
                </h1>
            </div>
            <div className="mb-10">
                <h1 className="text-4xl md:text-6xl font-game font-bold glow-text flex items-center justify-center space-x-3">
                    <Trophy className="w-8 h-8 text-primary" />
                    <span>Win/Lose</span>
                </h1>
            </div>
            <div className="mb-10">
                <h1 className="text-4xl md:text-6xl font-game font-bold glow-text flex items-center justify-center space-x-3">
                    <span>{localStorage.getItem("email")}</span>
                </h1>
            </div>
            {/* Login Card */}
            <form
                className="w-full max-w-sm bg-background/60 backdrop-blur-sm border border-border rounded-lg p-6 shadow-xl space-y-4"
            >

                <Button
                    type="submit"
                    className="w-full mt-4 font-semibold text-lg"
                    disabled={loading}
                >
                    {loading ? "Editing ..." : "Edit  "}
                </Button>

                {/* Divider */}
                <div className="flex items-center my-4">
                    <div className="flex-grow h-px bg-border" />
                    <span className="px-2 text-sm text-muted-foreground"></span>
                    <div className="flex-grow h-px bg-border" />
                </div>

            </form>
        </div>
    );
};

export default Profile;

