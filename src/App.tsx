import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Auth pages
import LoginPage from './features/auth/components/LoginPage';
import RegisterPage from './features/auth/components/RegisterPage';
import ForgotPasswordPage from './features/auth/components/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/components/ResetPasswordPage';
import GoogleCallbackPage from './features/auth/components/GoogleCallbackPage';

// Route guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// ── Placeholder pages (to be replaced as modules are built) ──
const HomePage = () => <div className="p-8 text-xl">Home — Browse Plants</div>;
const PlantDetailsPage = () => <div className="p-8 text-xl">Plant Details</div>;
const CartPage = () => <div className="p-8 text-xl">Cart</div>;
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
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/plants/:id" element={<PlantDetailsPage />} />

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/callback" element={<GoogleCallbackPage />} />

        {/* Protected user routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />
          <Route path="/ai/preview" element={<AIPreviewPage />} />
          <Route path="/ai/chat" element={<AIChatbotPage />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/plants" element={<AdminPlantsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
