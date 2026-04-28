// UserRole mirrors the backend's UserRole union in user.model.ts.
// Keeping a frontend copy prevents the UI from needing to hardcode strings for role checks.
export type UserRole =
  | 'user'
  | 'super_admin'
  | 'product_admin'
  | 'order_admin'
  | 'delivery_admin'
  | 'user_admin';

// Minimal user shape stored in Redux and localStorage after login/register.
// Sensitive fields (password, tokens) are never stored here.
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

// Request payload types — typed to match the exact JSON bodies the backend expects.
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
  token: string;       // raw token from the reset email URL query param
  newPassword: string;
}

// Response type for endpoints that issue tokens (login, register, Google OAuth).
export interface AuthResponse {
  success: true;
  data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  };
}

// Response type for endpoints that only confirm an action (forgot password, logout).
export interface MessageResponse {
  success: true;
  message: string;
}

// Response type for the /api/auth/refresh-token endpoint — only a new accessToken is returned.
export interface RefreshTokenResponse {
  success: true;
  data: {
    accessToken: string;
  };
}

// Redux slice state shape. loading and error are kept here so auth forms can
// use them via useAppSelector instead of local state.
export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
