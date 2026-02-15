import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import { Mail, ArrowLeft } from "lucide-react";
import "../css/change-password.css";

const ChangeEmail = () => {
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const updateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      const res = await userApi.update_email(newEmail, password);
      if (res.success) {
        toast.success("Email updated successfully!");
        localStorage.setItem("email", newEmail);
        navigate("/profile");
      } else {
        toast.error(res.message || "Email update failed.");
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
          <span>Back to Settings</span>
        </button>

        <Card className="change-password-card">
          <div className="change-password-header">
            <div className="icon-ring" style={{ background: "rgba(59, 130, 246, 0.14)", borderColor: "rgba(59, 130, 246, 0.24)" }}>
              <Mail className="mail-icon" />
            </div>
            <div>
              <h2>Change Email</h2>
              <p>Enter your new email and current password.</p>
            </div>
          </div>

          <form onSubmit={updateEmail} className="change-password-form">
            <div className="field">
              <label>New Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                placeholder="you@example.com"
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
              {loading ? "Updating..." : "Update Email"}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ChangeEmail;