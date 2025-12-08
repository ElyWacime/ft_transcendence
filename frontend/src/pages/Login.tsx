
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import { Trophy, Github } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 👇 Handle ?token=... redirect from GitHub OAuth

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      // 👇 instantly update auth context
      login(token, "github_user");

      toast.success("Successfully logged in with GitHub!");
      navigate("/tournament", { replace: true });
    }
  }, [navigate, login]);


  // 👇 Standard login form
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

  // 👇 GitHub OAuth redirect
  const handleGitHubLogin = () => {
    window.location.href = "http://10.12.7.4/api/users/auth/github";
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

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-border" />
          <span className="px-2 text-sm text-muted-foreground">or</span>
          <div className="flex-grow h-px bg-border" />
        </div>

        {/* GitHub OAuth Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2 font-semibold text-lg"
          onClick={handleGitHubLogin}
        >
          <Github className="w-5 h-5" />
          Continue with GitHub
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

