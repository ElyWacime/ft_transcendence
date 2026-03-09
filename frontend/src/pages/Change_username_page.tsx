import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import { User, ArrowLeft } from "lucide-react";
import "../css/change-password.css";
import { useAuth } from "@/context/AuthContext";

const ChangeUsername = () => {
  const navigate = useNavigate();
  const [newUsername, setNewUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { accessToken, updateAccessToken } = useAuth();

  const updateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      const res = await userApi.updateUsername(password, newUsername, accessToken, updateAccessToken);
      if (res.success) {
        toast.success("Username updated successfully!");
        navigate("/profile");
      } else {
        toast.error(res.message || "Username update failed.");
      }
    } catch (err) {
      toast.error("Server error, please try again later");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <div className="change-password-shell">
        <button
          variant="ghost"
          onClick={() => navigate("/profile")}
          className="back-link"
        >
          <ArrowLeft className="back-link-icon" />
          <span> </span>
        </button>

        <Card className="change-password-card">
          <div className="change-password-header">
            <div className="icon-ring" style={{ background: "rgba(59, 130, 246, 0.14)", borderColor: "rgba(59, 130, 246, 0.24)" }}>
              <User className="mail-icon" />
            </div>
            <div>
              <h2>Change Username</h2>
              <p>Enter your new username and current password.</p>
            </div>
          </div>

          <form onSubmit={updateUsername} className="change-password-form">
            <div className="field">
              <label>New Username</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
                placeholder="your-new-username"
              />
            </div>

            <div className="field">
              <label>Current Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Username"}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ChangeUsername;
