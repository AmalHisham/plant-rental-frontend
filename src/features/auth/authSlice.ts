import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AuthUser } from './types';

interface SetCredentialsPayload {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

// Reads the persisted session from localStorage so a page refresh doesn't sign the user out.
// Wrapped in try/catch because JSON.parse throws if the stored value is corrupted.
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
    // Corrupted storage — fall through to unauthenticated defaults.
  }
  return { user: null, accessToken: null, isAuthenticated: false };
};

// initialState merges the persisted fields with loading/error defaults.
// This means on the first render after a page refresh, isAuthenticated is already true
// if valid tokens exist in localStorage — no flicker to the login screen.
const initialState: AuthState = {
  ...loadFromStorage(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // setCredentials is dispatched after every successful login, register, or OAuth callback.
    // Writes to both Redux state and localStorage so the axios interceptor and future page
    // loads can read the tokens without going through the Redux store.
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

    // logout clears both Redux state and localStorage so no stale token remains anywhere.
    // The axios interceptor and ProtectedRoute both check these, so this fully invalidates
    // the session on the client side (the server also revokes the refresh token via /api/auth/logout).
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

    // setError clears the loading flag atomically so forms never stay stuck in loading state.
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setCredentials, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
