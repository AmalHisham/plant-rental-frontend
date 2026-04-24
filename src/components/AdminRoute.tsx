import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store';
import type { UserRole } from '../features/auth/types';

// All non-'user' roles are considered admin roles.
// This set is checked before rendering any /admin/* route.
const ADMIN_ROLES: UserRole[] = [
  'super_admin',
  'product_admin',
  'order_admin',
  'delivery_admin',
  'user_admin',
];

// AdminRoute applies two sequential checks:
// 1. Authentication — redirect to /login if not logged in.
// 2. Role — redirect to / (home) if logged in but not an admin.
// Using two separate redirects (vs. one) gives each failure case a distinct destination.
export default function AdminRoute() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ADMIN_ROLES.includes() is used (not a Set) because the list is small and
  // the UserRole union type satisfies the type signature cleanly.
  if (!user || !ADMIN_ROLES.includes(user.role as UserRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
