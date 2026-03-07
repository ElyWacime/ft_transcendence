
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, isLoading } = useAuth();

  // Wait for silent refresh before deciding if user should be redirected.
  if (isLoading) {
    return null;
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};
