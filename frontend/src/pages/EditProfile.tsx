
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import { Trophy, Github } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
const EditProfile = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    // if (token) {
    //   localStorage.setItem("token", token);
    //   // 👇 instantly update auth context
    //   login(token, "github_user");

    //   toast.success("Successfully logged in with GitHub!");
    //   navigate("/tournament", { replace: true });
    // }
  }, [navigate, login]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // const res = await userApi.login(email, name);
      // if (res.accessToken) {
      //   login(res.accessToken, email);
        
      //   toast.success("Welcome back!");
      //   navigate("/tournament");
      // } else {
      //   toast.error(res.message || "Login failed");
      // }
    } catch (err) {
      toast.error("Server error, please try again");
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

      </div>

      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-background/60 backdrop-blur-sm border border-border rounded-lg p-6 shadow-xl space-y-4"
      >
        <Avatar>
          <AvatarImage  src={"https://i1.sndcdn.com/avatars-000592840386-mwjcm6-t1080x1080.jpg"} ></AvatarImage>
          <AvatarFallback >RW</AvatarFallback>
        </Avatar>
        <div className="text-left">
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-md bg-muted/20 border border-border focus:outline-none focus:ring-2 focus:ring-primary text-white"
          />
        </div>
        <div className="text-left">
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-md bg-muted/20 border border-border focus:outline-none focus:ring-2 focus:ring-primary text-white"
          />
        </div>

        <Button
          type="submit"
          className="w-full mt-4 font-semibold text-lg"
          disabled={loading}
        >
          { "Edit"}
        </Button>
      </form>
    </div>
  );
};

export default EditProfile;

