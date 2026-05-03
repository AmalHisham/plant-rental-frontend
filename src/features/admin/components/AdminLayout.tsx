import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../store';
import { logout } from '../../auth/authSlice';
import type { UserRole } from '../../auth/types';

// ─── Icons ────────────────────────────────────────────────────────────────────

function DashboardIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-2a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
    </svg>
  );
}

function PlantIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 22V12m0 0C12 6 7 4 3 6c0 5 3 8 9 6zm0 0c0-6 5-8 9-6-1 5-4 8-9 6z" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0l-8 4m-8-4l8 4" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17 20h5v-1a4 4 0 00-5.924-3.516M9 20H4v-1a4 4 0 015.924-3.516M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 12l6-6M3 12l6 6" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface SidebarLink {
  to: string;
  label: string;
  icon: React.ReactNode;
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminLayout({ children }: Props) {
  const user = useAppSelector((s) => s.auth.user);
  const role = user?.role;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const links: SidebarLink[] = [
    {
      to: '/admin',
      label: 'Dashboard',
      icon: <DashboardIcon />,
      visible: role === 'super_admin',
      end: true,
    },
    {
      to: '/admin/plants',
      label: 'Plants',
      icon: <PlantIcon />,
      visible: role === 'super_admin' || role === 'product_admin',
    },
    {
      to: '/admin/orders',
      label: 'Orders',
      icon: <BoxIcon />,
      visible:
        role === 'super_admin' || role === 'order_admin' || role === 'delivery_admin',
    },
    {
      to: '/admin/users',
      label: 'Users',
      icon: <UsersIcon />,
      visible: role === 'super_admin' || role === 'user_admin',
    },
  ];

  const visibleLinks = links.filter((l) => l.visible);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside className="fixed top-0 left-0 h-full w-56 bg-gray-950 border-r border-gray-800 flex flex-col z-30">
        {/* Header */}
        <div className="px-5 py-5 border-b border-gray-800">
          <Link to="/admin" className="block">
            <span className="text-base font-bold text-green-400 tracking-tight">
              Admin Panel
            </span>
          </Link>
          {user && (
            <div className="mt-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-green-200">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-100 truncate">{user.name}</p>
                <span className="inline-block mt-0.5 text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full font-medium">
                  {ROLE_LABELS[user.role]}
                </span>
              </div>
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
                    ? 'bg-green-900/40 text-green-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-gray-800 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
          >
            <ArrowLeftIcon />
            Back to site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
          >
            <LogoutIcon />
            Log out
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 ml-56 min-h-screen">
        {children}
      </main>
    </div>
  );
}
