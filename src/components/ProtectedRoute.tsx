import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store';

// Redirects to /login if the user isn't logged in.
// replace keeps the browser history clean so they can't click "back" to bypass the check.
export default function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
