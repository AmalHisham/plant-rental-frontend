import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Auth pages
import LoginPage from './features/auth/components/LoginPage';
import RegisterPage from './features/auth/components/RegisterPage';
import ForgotPasswordPage from './features/auth/components/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/components/ResetPasswordPage';
import GoogleCallbackPage from './features/auth/components/GoogleCallbackPage';

// Home
import LandingPage from './features/home/components/LandingPage';

// Plant pages
import HomePage from './features/plants/components/HomePage';
import PlantDetailsPage from './features/plants/components/PlantDetailsPage';

// Wishlist / Cart
import WishlistPage from './features/wishlist/components/WishlistPage';
import CartPage from './features/cart/components/CartPage';

// Profile
import ProfilePage from './features/profile/components/ProfilePage';

// Checkout — intentionally navbar-free (distraction-free checkout pattern)
import CheckoutPage from './features/checkout/components/CheckoutPage';

// Orders
import OrdersPage from './features/orders/components/OrdersPage';
import OrderDetailsPage from './features/orders/components/OrderDetailsPage';

// Route guards — render an Outlet for authorised users, redirect otherwise
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Layout — renders Navbar + Outlet for all standard (non-admin, non-auth) pages
import MainLayout from './components/MainLayout';

import ScrollToTopButton from './components/ScrollToTopButton';

// Admin pages
import AdminDashboardPage from './features/admin/components/AdminDashboardPage';
import AdminPlantsPage from './features/admin/components/AdminPlantsPage';
import AdminOrdersPage from './features/admin/components/AdminOrdersPage';
import AdminUsersPage from './features/admin/components/AdminUsersPage';
import AdminProfilePage from './features/admin/components/AdminProfilePage';

const AIPreviewPage = () => <div className="p-8 text-xl">AI Office Preview</div>;
const AIChatbotPage = () => <div className="p-8 text-xl">AI Chatbot</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Standard pages — all share the Navbar via MainLayout ────────────── */}
        <Route element={<MainLayout />}>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/plants" element={<HomePage />} />
          <Route path="/plants/:id" element={<PlantDetailsPage />} />

          {/* Protected — redirects to /login if not logged in */}
          <Route element={<ProtectedRoute />}>
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/ai/preview" element={<AIPreviewPage />} />
            <Route path="/ai/chat" element={<AIChatbotPage />} />
          </Route>
        </Route>

        {/* ── Checkout — navbar-free for distraction-free payment flow ────────── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        {/* ── Auth routes — no navbar (full-screen auth forms) ────────────────── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* Google OAuth sends the user here with tokens in the query params */}
        <Route path="/auth/callback" element={<GoogleCallbackPage />} />

        {/* ── Admin routes — use AdminLayout sidebar, not the main Navbar ──────── */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/plants" element={<AdminPlantsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />
        </Route>

        {/* Any unknown URL → home page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* Outside <Routes> so it stays visible on every page */}
      <ScrollToTopButton />
    </BrowserRouter>
  );
}

export default App;
