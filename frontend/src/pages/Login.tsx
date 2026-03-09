
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // OAuth callback handling has been removed
  }, [navigate, login]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await userApi.login(email, password);
      if (res.accessToken && res.user) {
        // Store access token in memory (via context)
        // Refresh token is already in httpOnly cookie from backend
        login(res.accessToken, res.user);
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

  return (
    <div className="login-page">
      <div className="login-header">
        <h1 className="login-title glow-text">
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
        <button
          type="submit"
          className="login-button"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
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

