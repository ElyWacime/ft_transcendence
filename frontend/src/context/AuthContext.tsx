import { createContext, useContext, useState, useEffect } from "react";
import { userApi } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  accessToken: string | null;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  updateAccessToken: (token: string) => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  user: null,
  accessToken: null,
  login: () => {},
  logout: async () => {},
  updateAccessToken: () => {},
  updateUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const restoreSession = async () => {
      // console.log("[AuthContext] Attempting to restore session...");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || ""}/api/users/refresh`,
          {
            method: "POST",
            credentials: "include", 
          }
        );

        // console.log("[AuthContext] Refresh response status:", response.status);

        if (response.ok) {
          const text = await response.text();
          // console.log("[AuthContext] Raw response text:", text);
          const data = JSON.parse(text);
          // console.log("[AuthContext] Parsed response data:", data);
          // console.log("[AuthContext] data.user:", data.user);
          // console.log("[AuthContext] Session restored successfully", data);
          setAccessToken(data.accessToken);
          if (data.user) {
            setUser(data.user);
          } else {
            console.warn("[AuthContext] WARNING: No user data in response!");
          }
          // console.log("[AuthContext] State updated - accessToken:", !!data.accessToken, "user:", !!data.user);
        } else {
          // No valid session - user needs to log in
          const errorText = await response.text();
          // console.log("[AuthContext] No valid session, user needs to log in. Error:", errorText);
          setAccessToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error("[AuthContext] Session restore failed:", err);
        setAccessToken(null);
        setUser(null);
      } finally {
        // console.log("[AuthContext] Setting isLoading to false");
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = (token: string, userData: User) => {
    // console.log("[AuthContext] Login called with token:", !!token, "user:", userData);
    setAccessToken(token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      if (user?.email) {
        await userApi.logout(user.email);
      }
    } catch (e) {
      console.error("Logout failed", e);
    }
    setAccessToken(null);
    setUser(null);
  };

  const updateAccessToken = (token: string) => {
    setAccessToken(token);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : prev));
  };

  const isLoggedIn = !!accessToken && !!user;

  // console.log("[AuthContext] Current state - isLoggedIn:", isLoggedIn, "isLoading:", isLoading, "accessToken:", !!accessToken, "user:", !!user);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        accessToken,
        login,
        logout,
        updateAccessToken,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
