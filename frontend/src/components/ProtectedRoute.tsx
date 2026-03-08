
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, isLoading } = useAuth();


  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};
