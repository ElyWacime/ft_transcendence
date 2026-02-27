import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import { User, ArrowLeft } from "lucide-react";
import "../css/change-password.css";

const ChangeUsername = () => {
  const navigate = useNavigate();
  const [newUsername, setNewUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!newUsername.trim() || !password) {
      setError("Please enter a new username and your password.");
      return;
    }
    setLoading(true);
    try {
      await userApi.updateUsername(password, newUsername.trim());
      setSuccess("Username changed successfully!");
      setNewUsername("");
      setPassword("");
      toast.success("Username changed successfully!");
    } catch (err: any) {
      setError(err?.message || "Failed to change username");
      toast.error(err?.message || "Failed to change username");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <div className="change-password-shell">
        <button
          className="back-link"
          variant="ghost"
          onClick={() => navigate("/profile")}
        >
          <ArrowLeft className="back-link-icon" />
          <span> </span>
        </button>

        <Card className="profile-card profile-username-card">
          <div className="profile-username-section">
            <h3 className="profile-username-title">
              <User className="profile-username-icon" />
              <span>Change Username</span>
            </h3>
            <form onSubmit={updateUsername} className="profile-username-form">
              <input
                type="text"
                placeholder="New username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="profile-username-input"
                disabled={loading}
                required
              />
              <input
                type="password"
                placeholder="Enter your password to confirm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="profile-username-input"
                disabled={loading}
                required
              />
              <button
                type="submit"
                className="profile-username-btn"
                disabled={loading}
              >
                {loading ? "Changing..." : "Change Username"}
              </button>
              {error && <p className="profile-error-text">{error}</p>}
              {success && <p className="profile-success-text">{success}</p>}
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChangeUsername;
