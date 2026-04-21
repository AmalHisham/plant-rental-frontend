export type UserRole =
  | 'user'
  | 'super_admin'
  | 'product_admin'
  | 'order_admin'
  | 'delivery_admin'
  | 'user_admin';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

// ── Request bodies ──────────────────────────────────────────────
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// ── Response shapes ─────────────────────────────────────────────
export interface AuthResponse {
  success: true;
  data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  };
}

export interface MessageResponse {
  success: true;
  message: string;
}

export interface RefreshTokenResponse {
  success: true;
  data: {
    accessToken: string;
  };
}

// ── Redux state ─────────────────────────────────────────────────
export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
