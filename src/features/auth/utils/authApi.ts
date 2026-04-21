import axiosInstance from '../../../api/axiosInstance';
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  MessageResponse,
  RefreshTokenResponse,
  RegisterRequest,
  ResetPasswordRequest,
} from '../types';

export const registerApi = (body: RegisterRequest): Promise<AuthResponse> =>
  axiosInstance.post<AuthResponse>('/api/auth/register', body).then((r) => r.data);

export const loginApi = (body: LoginRequest): Promise<AuthResponse> =>
  axiosInstance.post<AuthResponse>('/api/auth/login', body).then((r) => r.data);

export const forgotPasswordApi = (body: ForgotPasswordRequest): Promise<MessageResponse> =>
  axiosInstance
    .post<MessageResponse>('/api/auth/forgot-password', body)
    .then((r) => r.data);

export const resetPasswordApi = (body: ResetPasswordRequest): Promise<MessageResponse> =>
  axiosInstance
    .post<MessageResponse>('/api/auth/reset-password', body)
    .then((r) => r.data);

export const refreshTokenApi = (refreshToken: string): Promise<RefreshTokenResponse> =>
  axiosInstance
    .post<RefreshTokenResponse>('/api/auth/refresh-token', { refreshToken })
    .then((r) => r.data);

export const logoutApi = (): Promise<MessageResponse> =>
  axiosInstance.post<MessageResponse>('/api/auth/logout').then((r) => r.data);
