import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../features/auth/authSlice';
import { useWishlist } from '../features/wishlist/hooks/wishlistQueries';
import { useCart } from '../features/cart/hooks/cartQueries';
import type { UserRole } from '../features/auth/types';

// Set for O(1) admin-role lookup — used both in the desktop and mobile menus.
const ADMIN_ROLES = new Set<UserRole>([
  'super_admin',
  'product_admin',
  'order_admin',
  'delivery_admin',
  'user_admin',
]);

// ─── Inline SVG icons ──────────────────────────────────────────────────────────
// Kept as small components (not imported from an icon library) to avoid a dependency
// and to keep the SVG paths readable alongside the code that uses them.

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ─── IconButton ───────────────────────────────────────────────────────────────
// Reusable icon link with an optional count badge (e.g. cart items, wishlist items).
// badge > 99 shows '99+' to prevent the badge from overflowing its container.

interface IconButtonProps {
  to: string;
  label: string;
  badge?: number;
  children: React.ReactNode;
}

function IconButton({ to, label, badge, children }: IconButtonProps) {
  return (
    <Link
      to={to}
      className="relative p-2 text-gray-500 hover:text-green-700 transition-colors rounded-lg hover:bg-green-50"
      aria-label={label}
    >
      {children}
      {badge != null && badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-green-600 text-white rounded-full px-1 leading-none">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // profileRef is used to close the profile dropdown when clicking outside it.
  const profileRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Wishlist and cart counts come from React Query — they stay in sync with the server
  // cache without needing Redux. ?? 0 handles the loading state (undefined).
  const { data: wishlistData } = useWishlist();
  const wishlistCount = wishlistData?.data.wishlist.plants.length ?? 0;

  const { data: cartData } = useCart();
  const cartCount = cartData?.data.cart.items.length ?? 0;

  // isOnLanding controls whether the "How It Works" anchor link is shown.
  const isOnLanding = location.pathname === '/';
  const isAdmin = user?.role != null && ADMIN_ROLES.has(user.role);

  // User initials for the avatar — max 2 characters (first letter of each name part).
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '';

  const closeMenu = () => setMenuOpen(false);

  // Scroll listener adds a shadow to the navbar once the page is scrolled past 0px.
  // passive: true tells the browser this listener never calls preventDefault(), allowing
  // it to run scroll handling on a separate thread for better performance.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the profile dropdown when the user clicks outside the profileRef container.
  // Uses mousedown (not click) so the dropdown closes before any click inside it fires.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-green-700 shrink-0">
            <span className="text-2xl leading-none">🌿</span>
            <span>LeafRent</span>
          </Link>

          {/* Desktop centre navigation links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink
              to="/plants"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-green-700' : 'text-gray-600 hover:text-green-700'}`
              }
            >
              Browse Plants
            </NavLink>
            {/* "How It Works" is an in-page anchor, shown only on the landing page */}
            {isOnLanding && (
              <a
                href="#how-it-works"
                className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors"
              >
                How It Works
              </a>
            )}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-green-700' : 'text-gray-600 hover:text-green-700'}`
                }
              >
                Admin Panel
              </NavLink>
            )}
          </div>

          {/* Desktop right: wishlist, cart, user menu */}
          <div className="hidden md:flex items-center gap-1">
            {/* Wishlist and cart icons are hidden for admins — they are customer-only features */}
            {isAuthenticated && !isAdmin && (
              <IconButton to="/wishlist" label="Wishlist" badge={wishlistCount}>
                <HeartIcon />
              </IconButton>
            )}
            {!isAdmin && (
              <IconButton to="/cart" label="Cart" badge={isAuthenticated ? cartCount : undefined}>
                <CartIcon />
              </IconButton>
            )}

            {isAuthenticated ? (
              // Profile avatar + dropdown
              <div className="relative ml-2" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Profile menu"
                >
                  <div className="w-7 h-7 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <ChevronDownIcon />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-800 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                    {!isAdmin && (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setProfileOpen(false)}
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          My Orders
                        </Link>
                      </>
                    )}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { dispatch(logout()); setProfileOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger — hidden on md+ screens */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile drawer — rendered below the navbar bar when menuOpen is true */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-5 flex flex-col gap-4">
          <NavLink
            to="/plants"
            onClick={closeMenu}
            className="text-sm font-medium text-gray-700 hover:text-green-700"
          >
            Browse Plants
          </NavLink>
          {isOnLanding && (
            <a
              href="#how-it-works"
              onClick={closeMenu}
              className="text-sm font-medium text-gray-700 hover:text-green-700"
            >
              How It Works
            </a>
          )}
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={closeMenu}
              className="text-sm font-medium text-gray-700 hover:text-green-700"
            >
              Admin Panel
            </NavLink>
          )}

          <hr className="border-gray-100" />

          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
              {!isAdmin && (
                <div className="flex flex-col gap-1">
                  <Link
                    to="/wishlist"
                    onClick={closeMenu}
                    className="flex items-center justify-between text-sm text-gray-700 hover:text-green-700 py-1.5"
                  >
                    <span>Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/cart"
                    onClick={closeMenu}
                    className="flex items-center justify-between text-sm text-gray-700 hover:text-green-700 py-1.5"
                  >
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="text-sm text-gray-700 hover:text-green-700 py-1.5"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={closeMenu}
                    className="text-sm text-gray-700 hover:text-green-700 py-1.5"
                  >
                    My Orders
                  </Link>
                </div>
              )}
              <button
                onClick={() => { dispatch(logout()); closeMenu(); }}
                className="text-sm text-red-500 text-left py-1"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="flex-1 text-center text-sm font-medium py-2 border border-gray-200 rounded-lg text-gray-700 hover:border-green-600 hover:text-green-700 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="flex-1 text-center text-sm font-semibold py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
