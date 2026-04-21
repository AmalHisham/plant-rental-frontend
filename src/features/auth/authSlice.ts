import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AuthUser } from './types';

interface SetCredentialsPayload {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

const loadFromStorage = (): Pick<AuthState, 'user' | 'accessToken' | 'isAuthenticated'> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const userRaw = localStorage.getItem('authUser');
    if (accessToken && userRaw) {
      return {
        user: JSON.parse(userRaw) as AuthUser,
        accessToken,
        isAuthenticated: true,
      };
    }
  } catch {
    // corrupted storage — fall through to defaults
  }
  return { user: null, accessToken: null, isAuthenticated: false };
};

const initialState: AuthState = {
  ...loadFromStorage(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<SetCredentialsPayload>) {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('authUser', JSON.stringify(user));
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('authUser');
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setCredentials, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
