import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { clearSession, getSession } from '../../core/lib/session';

export default function ProtectedRoute({ children }) {
  const session = getSession();

  useEffect(() => {
    if (!session?.expiresAt) return;

    const remainingMs = session.expiresAt - Date.now();
    if (remainingMs <= 0) {
      clearSession();
      window.location.assign('/auth?expired=1');
      return;
    }

    const timer = setTimeout(() => {
      clearSession();
      window.location.assign('/auth?expired=1');
    }, remainingMs);

    return () => clearTimeout(timer);
  }, [session?.expiresAt]);

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return children ? children : <Outlet />;
}

