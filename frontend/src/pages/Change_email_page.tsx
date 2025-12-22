import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import { Mail, ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-secondary px-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/profile")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Settings
        </Button>

        <Card className="p-8 bg-background/60 backdrop-blur-sm border border-border">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold">Change Email</h2>
            <p className="text-muted-foreground text-sm mt-2">
              Enter your new email and current password
            </p>
          </div>

          <form onSubmit={updateEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                New Email
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="w-full p-3 rounded-md bg-muted/20 border border-border focus:outline-none focus:ring-2 focus:ring-primary text-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Current Password
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
              className="w-full mt-4 font-semibold"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Email"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ChangeEmail;