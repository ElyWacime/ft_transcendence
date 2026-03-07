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
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  user: null,
  accessToken: null,
  login: () => {},
  logout: async () => {},
  updateAccessToken: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Access token stored ONLY in memory (React state) - never in localStorage
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Silent refresh: Restore session on app load/refresh
  // Refresh token is in httpOnly cookie, so we just call /refresh
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Call refresh endpoint - browser automatically sends refresh_token cookie
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || ""}/api/users/refresh`,
          {
            method: "POST",
            credentials: "include", // Important: send cookies
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAccessToken(data.accessToken);
          if (data.user) {
            setUser(data.user);
          }
        } else {
          // No valid session - user needs to log in
          setAccessToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error("Session restore failed:", err);
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = (token: string, userData: User) => {
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

  const isLoggedIn = !!accessToken && !!user;

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
