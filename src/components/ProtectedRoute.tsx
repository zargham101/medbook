import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/lib/api';
import { Spinner } from '@/components/ui';

export function ProtectedRoute({ children, role }: { children: ReactNode; role?: UserRole }) {
  const { session, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && profile?.role !== role) {
    const home = profile?.role === 'DOCTOR' ? '/doctor' : profile?.role === 'ADMIN' ? '/admin' : '/patient';
    return <Navigate to={home} replace />;
  }

  return <>{children}</>;
}
