import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRoute = ({ children, redirectTo = '/profile' }: PublicRouteProps) => {
  const { isLoggedIn, isLoading } = useAuth();

  // Avoid rendering auth pages while session restore is running.
  if (isLoading) {
    return null;
  }

  if (isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};