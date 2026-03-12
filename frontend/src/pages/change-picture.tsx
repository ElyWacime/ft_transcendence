import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import { playerDashboardApi_ayoub } from "@/lib/api_ayoub";
import { Camera, ArrowLeft, Upload } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import "../css/change-password.css";

const ChangePicture = () => {
  const navigate = useNavigate();
  const { user, accessToken, updateAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState("");
  const [currentAvatar, setCurrentAvatar] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchCurrentAvatar = async () => {
      try {
        const userId = user?.id;
        if (userId) {
          setCurrentAvatar(user.avatar || "");
          setPreviewUrl(user.avatar || "");
          setUsername(user.User_name || "");
        }
      } catch (error) {
        console.error("Failed to fetch current avatar:");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCurrentAvatar();
  }, [user?.id]);

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
      
      const res = await userApi.update_image(imageData, accessToken, updateAccessToken);
      
      if (res.success) {
        toast.success("Profile image updated successfully!");
        
        window.dispatchEvent(new Event('avatarUpdated'));
        
        navigate("/profile");
        
        window.location.reload();
      } else {
        toast.error(res.message || "Image update failed.");
      }
    } catch (err) {
      toast.error("Failed to process image. Please try again.");
    } finally {
      setLoading(false);
      if (fileInput) {
        fileInput.value = '';
      }
    }
  };

  return (
    <div className="change-password-page">
      {initialLoading ? (
        <div className="change-password-shell">
          <Card className="change-password-card">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading...</p>
            </div>
          </Card>
        </div>
      ) : (
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
              <div className="icon-ring" style={{ background: "rgba(147, 51, 234, 0.14)", borderColor: "rgba(147, 51, 234, 0.24)" }}>
                <Camera className="camera-icon" />
              </div>
              <div>
                <h2>Change Profile Picture</h2>
                <p>Upload a new profile picture.</p>
              </div>
            </div>

            <form onSubmit={updateImage} className="change-password-form" style={{ gap: "18px" }}>
              <div className="avatar-center">
                <Avatar className="avatar-large">
                  <AvatarImage src={previewUrl || "https://scx2.b-cdn.net/gfx/news/2019/galaxy.jpg"} />
                  <AvatarFallback className="avatar-fallback-large">
                    {username?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div>
                <label
                  htmlFor="image_id"
                  className="upload-dropzone"
                  role="button"
                >
                  <Upload className="upload-icon" />
                  <span className="upload-hint">Click to upload or drag and drop</span>
                  <p className="upload-note">PNG, JPG, GIF or WEBP (max 2MB)</p>
                </label>
                <input
                  type="file"
                  id="image_id"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input-hidden"
                />
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Update Picture"}
              </button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ChangePicture;