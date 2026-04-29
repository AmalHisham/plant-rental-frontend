import { NavLink, Link } from 'react-router-dom';
import { useAppSelector } from '../../../store';
import type { UserRole } from '../../auth/types';

interface SidebarLink {
  to: string;
  label: string;
  icon: string;
  visible: boolean;
  end?: boolean;
}

interface Props {
  children: React.ReactNode;
}

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  product_admin: 'Product Admin',
  order_admin: 'Order Admin',
  delivery_admin: 'Delivery Admin',
  user_admin: 'User Admin',
  user: 'User',
};

export default function AdminLayout({ children }: Props) {
  const user = useAppSelector((s) => s.auth.user);
  const role = user?.role;

  const links: SidebarLink[] = [
    {
      to: '/admin',
      label: 'Dashboard',
      icon: '📊',
      visible: role === 'super_admin',
      end: true,
    },
    {
      to: '/admin/plants',
      label: 'Plants',
      icon: '🪴',
      visible: role === 'super_admin' || role === 'product_admin',
    },
    {
      to: '/admin/orders',
      label: 'Orders',
      icon: '📦',
      visible:
        role === 'super_admin' || role === 'order_admin' || role === 'delivery_admin',
    },
    {
      to: '/admin/users',
      label: 'Users',
      icon: '👥',
      visible: role === 'super_admin' || role === 'user_admin',
    },
  ];

  const visibleLinks = links.filter((l) => l.visible);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside className="fixed top-0 left-0 h-full w-56 bg-white border-r border-gray-200 flex flex-col z-30">
        {/* Header */}
        <div className="px-5 py-5 border-b border-gray-100">
          <Link to="/admin" className="block">
            <span className="text-base font-bold text-green-700 tracking-tight">
              Admin Panel
            </span>
          </Link>
          {user && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-gray-800 truncate">{user.name}</p>
              <span className="inline-block mt-0.5 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                {ROLE_LABELS[user.role]}
              </span>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-gray-100">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <span>←</span>
            Back to site
          </Link>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 ml-56 min-h-screen">
        {children}
      </main>
    </div>
  );
}
