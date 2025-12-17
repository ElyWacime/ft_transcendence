
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import { Trophy } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const navigate = useNavigate();
  const [new_email, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [pass, setPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confNewPass, setConfNewPass] = useState("");

  const updateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPass !== confNewPass) {
      toast.error("New passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      const res = await userApi.update_email(new_email, password);
      if (res.success) {
        toast.success("Email updated successfuly!");
        localStorage.setItem("email", new_email);
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

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await userApi.update_password(pass, newPass);
      if (res.success) {
        toast.success("Password updated successfully!");
        navigate("/profile");
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

  const updateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('image_id') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    
    if (!file) {
      toast.error("Please select an image file");
      return;
    }
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }
    
    // Check file size
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size should be less than 2MB");
      return;
    }
    
    setLoading(true);
    try {
      const reader = new FileReader();
      
      const base64Image = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          if (reader.result) {
            // Get base64 string (remove data:image/...;base64, prefix)
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
          } else {
            reject(new Error("Failed to read file"));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      
      // Prepare data to send - matches backend schema
      const imageData = {
        image: base64Image,     // Base64 string (required)
        image_name: file.name,  // Original filename (required)
        // Optional fields if you want to store them
        file_type: file.type,
        file_size: file.size
      };
      
      // This should now work with the corrected API method
      const res = await userApi.update_image(imageData);
      
      if (res.success) {
        toast.success("Profile image updated successfully!");
        
        if (res.avatar_url) {
          localStorage.setItem('avatar_url', res.avatar_url);
        }
        
        navigate("/profile");
      } else {
        toast.error(res.message || "Image update failed.");
      }
    } catch (err) {
      toast.error("Failed to process image. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      if (fileInput) {
        fileInput.value = '';
      }
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
        {/* <div className="text-left">
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
        </div> */}

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

      <form
        onSubmit={updatePassword}
        className="w-full max-w-sm bg-background/60 backdrop-blur-sm border border-border rounded-lg p-6 shadow-xl space-y-4"
      >
        <div className="text-left">
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Old password
          </label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            // required
            className="w-full p-3 rounded-md bg-muted/20 border border-border focus:outline-none focus:ring-2 focus:ring-primary text-white"
            placeholder="••••••••"
          />
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            New Password
          </label>
          <input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
            className="w-full p-3 rounded-md bg-muted/20 border border-border focus:outline-none focus:ring-2 focus:ring-primary text-white"
            placeholder="••••••••"
          />
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Confirm new password
          </label>
          <input
            type="password"
            value={confNewPass}
            onChange={(e) => setConfNewPass(e.target.value)}
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
          {loading ? "Profileing..." : "Update Password"}
        </Button>
      </form>
      
      <form
        onSubmit={updateImage}
        className="w-full max-w-sm bg-background/60 backdrop-blur-sm border border-border rounded-lg p-6 shadow-xl space-y-4"
      >
        <Avatar>
          <AvatarImage src="../../public/avatar.jpg" />
        </Avatar>

        <input type="file" id="image_id"/>
        
        <Button
          type="submit"
          className="w-full mt-4 font-semibold text-lg"
          disabled={loading}
        >
          {loading ? "Profileing..." : "Update Image"}
        </Button>
      </form>
    </div>
  );
};

export default Profile;
