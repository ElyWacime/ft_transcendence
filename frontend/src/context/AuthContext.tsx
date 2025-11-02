
import { createContext, useContext, useState, useEffect } from "react";
import { userApi } from "@/lib/api";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string, email: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    // initialize from localStorage on first render
    return !!localStorage.getItem("token");
  });

  const login = (token: string, email: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    setIsLoggedIn(true); // triggers re-render
  };

  const logout = async () => {
    const email = localStorage.getItem("email");
    try {
      if (email) await userApi.logout(email);
    } catch (e) {
      console.error("Logout failed", e);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setIsLoggedIn(false); // triggers re-render
  };

  // Optional effect to sync if localStorage changes externally
  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

