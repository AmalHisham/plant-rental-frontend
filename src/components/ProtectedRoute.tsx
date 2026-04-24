import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store';

// ProtectedRoute wraps private user routes in App.tsx.
// When isAuthenticated is false, it performs a client-side redirect to /login.
// replace: true replaces the current history entry so the user can't go "back" to the
// protected page after being redirected — avoids a confusing forward/back loop.
// When isAuthenticated is true, <Outlet /> renders the matched child route.
export default function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
