import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Gamepad2, Zap } from "lucide-react";
import { useEffect } from "react";
const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Trophy,
      title: "Tournament Mode",
      description: "Compete in elimination tournaments with dynamic brackets",
      page: "/online-tournament",
    },
    {
      icon: Users,
      title: "1 vs 1",
      description: "Play with a friend on the same keyboard",
      page: "/game"
    },
    {
      icon: Gamepad2,
      title: "1 vs 1 Online",
      description: "Play with players online",
      page: "/loading?mode=2",
    },
    {
      icon: Gamepad2,
      title: "2 vs 2 Online",
      description: "Team up and play against another team",
      page: "/loading?mode=4",
    },
    {
      icon: Zap,
      title: "1 vs AI",
      description: "Outsmart this AI ",
    }
  ];
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
            The ultimate retro gaming tournament experience.
            Compete, dominate, and become the Pong champion!
          </p>
          <Button
            size="lg"
            onClick={() => {navigate("/online-tournament") }}
            className="bg-gradient-primary hover:scale-105 transition-transform duration-300 animate-pulse-glow text-lg px-8 py-4 font-game"
          >
            <Trophy className="w-6 h-6 mr-2" />
            START TOURNAMENT
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-game font-bold text-center mb-12 glow-text">
            Game Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card onClick={() => { navigate(feature.page) }}
              // <Card  onClick={() => { console.log(feature, index);  navigate(feature.page) }}
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
      </section>

      {/* Quick Actions */}
      <section className="py-20 px-4 bg-gradient-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-game font-bold mb-8 glow-text">Ready to Play?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => { navigate("/online-tournament") }}
              className="font-medium"
            >
              <Users className="w-5 h-5 mr-2" />
              Setup Tournament
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => { navigate("/game") }}
              className="font-medium"
            >
              <Gamepad2 className="w-5 h-5 mr-2" />
              Quick Game
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
