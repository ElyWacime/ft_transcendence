
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import { Trophy } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [new_email, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const updateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await userApi.update_email(email, new_email, password);
      if (res.success) {
        toast.success("Email updated successfuly!");
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-secondary text-center px-4">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-6xl font-game font-bold glow-text flex items-center justify-center space-x-3">
          <Trophy className="w-8 h-8 text-primary" />
          <span>FT TRANSCENDENCE</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Create your account and join the arena 🕹️
        </p>
      </div>

      {/* Profile Card */}
      <form
        onSubmit={updateEmail}
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
            placeholder="Player name"
          />
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            New Email
          </label>
          <input
            type="email"
            value={new_email}
            onChange={(e) => setNewEmail(e.target.value)}
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
          {loading ? "Profileing..." : "Update Email"}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-muted-foreground mt-6 text-sm">
        Already have an account?{" "}
        <button
          className="text-primary hover:underline"
          onClick={() => navigate("/login")}
        >
          Log in
        </button>
      </p>
    </div>
  );
};

export default Profile;
