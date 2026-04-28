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

// Route guards — render an Outlet for authorised users, redirect otherwise
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Stub pages for features not yet implemented — inline so they don't pollute the file tree
const CheckoutPage = () => <div className="p-8 text-xl">Checkout</div>;
const OrdersPage = () => <div className="p-8 text-xl">My Orders</div>;
const OrderDetailsPage = () => <div className="p-8 text-xl">Order Details</div>;
const AdminDashboardPage = () => <div className="p-8 text-xl">Admin Dashboard</div>;
const AdminPlantsPage = () => <div className="p-8 text-xl">Admin — Plants</div>;
const AdminOrdersPage = () => <div className="p-8 text-xl">Admin — Orders</div>;
const AdminUsersPage = () => <div className="p-8 text-xl">Admin — Users</div>;
const AIPreviewPage = () => <div className="p-8 text-xl">AI Office Preview</div>;
const AIChatbotPage = () => <div className="p-8 text-xl">AI Chatbot</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public routes ──────────────────────────────────────────────────── */}
        {/* These pages are accessible without a login (marketing, browsing, auth flows). */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/plants" element={<HomePage />} />
        <Route path="/plants/:id" element={<PlantDetailsPage />} />

        {/* ── Auth routes ─────────────────────────────────────────────────────── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* /auth/callback receives tokens as query params after Google OAuth redirect */}
        <Route path="/auth/callback" element={<GoogleCallbackPage />} />

        {/* ── Protected user routes ────────────────────────────────────────────── */}
        {/* ProtectedRoute renders an Outlet when the user is logged in,
            or redirects to /login if no access token is found. */}
        <Route element={<ProtectedRoute />}>
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />
          <Route path="/ai/preview" element={<AIPreviewPage />} />
          <Route path="/ai/chat" element={<AIChatbotPage />} />
        </Route>

        {/* ── Admin-only routes ───────────────────────────────────────────────── */}
        {/* AdminRoute renders an Outlet only for users whose role is not 'user',
            or redirects to / for regular users who navigate here directly. */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/plants" element={<AdminPlantsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>

        {/* Catch-all: unknown paths go to the landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
