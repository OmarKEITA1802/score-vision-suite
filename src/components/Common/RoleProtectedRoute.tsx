import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, User } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: User['role'][];
  fallback?: React.ReactNode;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  fallback 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
              <br />
              <span className="text-sm text-muted-foreground mt-2 block">
                Rôle requis : {allowedRoles.join(', ')}
              </span>
            </AlertDescription>
          </Alert>
        </div>
      )
    );
  }

  return <>{children}</>;
};