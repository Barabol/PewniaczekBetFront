import { Navigate } from 'react-router-dom';
import { useAuth } from '../context';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isLoggedIn, isAuthLoading, user } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    const isAdmin =
      user?.accountTypeId === 3 ||
      user?.name?.toLowerCase().includes('admin') ||
      user?.surname?.toLowerCase().includes('admin');

    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
