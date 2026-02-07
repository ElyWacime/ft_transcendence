import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRoute = ({ children, redirectTo = '/profile' }: PublicRouteProps) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};