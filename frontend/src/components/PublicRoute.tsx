// components/PublicRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRoute = ({ children, redirectTo = '/profile' }: PublicRouteProps) => {
  const { isLoggedIn } = useAuth();

  // If user is already logged in, redirect to profile (or specified route)
  if (isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  // If not logged in, show the public page (login/register)
  return <>{children}</>;
};