
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");

    if (token && email) {
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);

      login(token, email);

      toast.success("Successfully logged in with GitHub!");
      navigate("/tournament", { replace: true });
    }
  }, [navigate, login]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await userApi.login(email, password);
      if (res.accessToken) {
        login(res.accessToken, email);
        toast.success("Welcome back!");
        navigate("/");
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

  const handleGitHubLogin = () => {
    window.location.href = `${window.location.origin}/api/users/auth/github`;
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <h1 className="login-title glow-text">
          <Trophy className="trophy-icon" />
          <span>FT TRANSCENDENCE</span>
        </h1>
        <p className="login-subtitle">
          Log in to continue your journey 🕹️
        </p>
      </div>

      <form
        onSubmit={handleLogin}
        className="login-form"
      >
        <div className="form-group">
          <label className="form-label">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
            placeholder="you@example.com"
          />
        </div>
  
        <div className="form-group">
          <label className="form-label">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
            placeholder="••••••••"
          />
        </div>
        <Button
          type="submit"
          className="login-button"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
        <div className="form-divider">
          <div className="divider-line" />
          <span className="divider-text">or</span>
          <div className="divider-line" />
        </div>
        <Button
          type="button"
          variant="outline"
          className="github-login-button"
          onClick={handleGitHubLogin}
        >
          <Github className="github-icon" />
          Continue with GitHub
        </Button>
      </form>
      <p className="login-footer">
        Don't have an account?{" "}
        <button
          className="signup-link"
          onClick={() => navigate("/register")}
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default Login;

