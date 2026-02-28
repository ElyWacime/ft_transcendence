
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import { Trophy } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await userApi.register(email, password, name);
      if (res.id) {
        toast.success("Account created successfully! You can now log in.");
        navigate("/login");
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (err) {
      toast.error("Server error, please try again later");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-header">
        <h1 className="register-title glow-text">
          <Trophy className="trophy-icon" />
          <span>FT TRANSCENDENCE</span>
        </h1>
        <p className="register-subtitle">
          Create your account and join the arena 🕹️
        </p>
      </div>
      <form
        onSubmit={handleRegister}
        className="register-form"
      >
        <div className="form-group">
          <label className="form-label">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
            placeholder="Player name"
          />
        </div>
  
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
          className="register-button"
          disabled={loading}
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>
      </form>
      <p className="register-footer">
        Already have an account?{" "}
        <button
          className="login-link"
          onClick={() => navigate("/login")}
        >
          Log in
        </button>
      </p>
    </div>
  );
};

export default Register;
