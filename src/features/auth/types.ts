// All possible user roles in the app
export type UserRole =
  | 'user'
  | 'super_admin'
  | 'product_admin'
  | 'order_admin'
  | 'delivery_admin'
  | 'user_admin';

// Basic user info saved in Redux and localStorage after login
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

// What the frontend sends to the backend for each auth action
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
  token: string;       // token from the reset-password email link
  newPassword: string;
}

// What the backend returns after a successful login, register, or Google OAuth
export interface AuthResponse {
  success: true;
  data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  };
}

// What the backend returns for actions that don't need to return data (e.g. logout)
export interface MessageResponse {
  success: true;
  message: string;
}

// What the backend returns when refreshing the access token
export interface RefreshTokenResponse {
  success: true;
  data: {
    accessToken: string;
  };
}

// The shape of the auth section inside the Redux store
export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
