import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api, userApi } from "@/lib/api"; // assumes you have an api wrapper like in your Game page
import { Trophy } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await userApi.login(email, password);
      if (res.accessToken) {
        login(res.accessToken, email);

        toast.success("Welcome back!");
        navigate("/tournament");
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (err) {
      toast.error("Server error, please try again");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-secondary text-center px-4">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-6xl font-game font-bold glow-text flex items-center justify-center space-x-3">
          <Trophy className="w-8 h-8 text-primary" />
          <span>FT TRANSCENDENCE</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Log in to continue your journey 🕹️
        </p>
      </div>

      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-background/60 backdrop-blur-sm border border-border rounded-lg p-6 shadow-xl space-y-4"
      >
        <div className="text-left">
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-md bg-muted/20 border border-border focus:outline-none focus:ring-2 focus:ring-primary text-white"
            placeholder="you@example.com"
          />
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-md bg-muted/20 border border-border focus:outline-none focus:ring-2 focus:ring-primary text-white"
            placeholder="••••••••"
          />
        </div>

        <Button
          type="submit"
          className="w-full mt-4 font-semibold text-lg"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-muted-foreground mt-6 text-sm">
        Don’t have an account?{" "}
        <button
          className="text-primary hover:underline"
          onClick={() => navigate("/register")}
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default Login;
