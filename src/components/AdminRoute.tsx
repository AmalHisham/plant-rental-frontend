import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store';
import type { UserRole } from '../features/auth/types';

const ADMIN_ROLES: UserRole[] = [
  'super_admin',
  'product_admin',
  'order_admin',
  'delivery_admin',
  'user_admin',
];

export default function AdminRoute() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !ADMIN_ROLES.includes(user.role as UserRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
