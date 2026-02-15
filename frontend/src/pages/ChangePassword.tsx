import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import { Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import "../css/change-password.css";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await userApi.update_password(oldPassword, newPassword);
      if (res.success) {
        toast.success("Password updated successfully!");
        await logout();
        navigate("/login");
      } else {
        toast.error(res.message || "Password update failed.");
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
            <div className="icon-ring">
              <Lock className="lock-icon" />
            </div>
            <div>
              <h2>Change Password</h2>
              <p>Enter your current and new password.</p>
            </div>
          </div>

          <form onSubmit={updatePassword} className="change-password-form">
            <div className="field">
              <label>Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <div className="field">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <div className="field">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ChangePassword;