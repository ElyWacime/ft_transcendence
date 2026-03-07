
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, isLoading } = useAuth();

  console.log("[ProtectedRoute] isLoading:", isLoading, "isLoggedIn:", isLoggedIn);

  // Wait for silent refresh before deciding if user should be redirected.
  if (isLoading) {
    console.log("[ProtectedRoute] Still loading, showing nothing");
    return null;
  }

  if (!isLoggedIn) {
    console.log("[ProtectedRoute] Not logged in, redirecting to /login");
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};
