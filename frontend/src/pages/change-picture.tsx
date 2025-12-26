import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import { Camera, ArrowLeft, Upload } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function getUserIdFromToken(): string | null {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.id || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

const ChangePicture = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState("");
  const [currentAvatar, setCurrentAvatar] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchCurrentAvatar = async () => {
      try {
        const userId = getUserIdFromToken();
        if (userId) {
          const data = await userApi.getUserById(userId);
          setCurrentAvatar(data.avatar || "");
          setPreviewUrl(data.avatar || "");
          setUsername(data.User_name || data.user_name || "");
        }
      } catch (error) {
        console.error("Failed to fetch current avatar:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCurrentAvatar();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
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
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }
    
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
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
          } else {
            reject(new Error("Failed to read file"));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      
      const imageData = {
        image: base64Image,
        image_name: file.name,
        file_type: file.type,
        file_size: file.size
      };
      
      const res = await userApi.update_image(imageData);
      
      if (res.success) {
        toast.success("Profile image updated successfully!");
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('avatarUpdated'));
        
        // Navigate back to profile
        navigate("/profile");
        
        // Force a page refresh to update all avatars from database
        window.location.reload();
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-secondary px-4">
      {initialLoading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
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
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold">Change Profile Picture</h2>
              <p className="text-muted-foreground text-sm mt-2">
                Upload a new profile picture
              </p>
            </div>

            <form onSubmit={updateImage} className="space-y-6">
              {/* Large Avatar Preview */}
              <div className="flex justify-center">
                <Avatar className="w-48 h-48 border-4 border-primary/20">
                  <AvatarImage src={previewUrl || "https://www.gravatar.com/avatar/"} />
                  <AvatarFallback className="text-6xl">
                    {username?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* File Input */}
              <div>
                <label 
                  htmlFor="image_id" 
                  className="block w-full p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors text-center"
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF or WEBP (max 2MB)
                  </p>
                </label>
                <input
                  type="file"
                  id="image_id"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <Button
                type="submit"
                className="w-full font-semibold"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Update Picture"}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ChangePicture;