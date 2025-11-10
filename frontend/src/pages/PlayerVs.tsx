import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Gamepad2, Zap, Bot } from "lucide-react";

const PlayerVs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-30"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-game font-bold mb-6 glow-text animate-float">
            PONG
            <span className="text-primary"> ARENA</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The ultimate retro gaming tournament experience.
            Compete, dominate, and become the Pong champion!
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/game")}
            className="bg-gradient-primary hover:scale-105 transition-transform duration-300 animate-pulse-glow text-lg px-8 py-4 font-game"
          >
            <Trophy className="w-6 h-6 mr-2" />
            START Game
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-game font-bold text-center mb-12 glow-text">
            Game Features
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-1">
            <Card
              key={0}
              className="p-6 bg-gradient-secondary border-border hover:border-primary transition-all duration-300 hover:shadow-glow group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg">{localStorage.getItem("email")}</h3>
                <p className="text-muted-foreground text-sm">name1</p>
              </div>
            </Card>
            <Card
              key={1}
              className="p-6 bg-gradient-secondary border-border hover:border-primary transition-all duration-300 hover:shadow-glow group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg">{localStorage.getItem("email")}</h3>
                <p className="text-muted-foreground text-sm">name2</p>
              </div>
            </Card>

          </div>
        </div>
      </section>

    </div>
  );
};

export default PlayerVs;
