import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AuthUser } from './types';

// The data we get back from the server after a successful login
interface SetCredentialsPayload {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

// Read saved login info from localStorage so the user stays logged in after a page refresh
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
    // Corrupted data — treat as logged out
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
    // Called after login, register, or Google OAuth — saves user and tokens everywhere
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

    // Clears login state from Redux and localStorage (server also revokes the refresh token)
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

    // Show or hide the loading spinner on auth forms
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    // Save an error message and stop the spinner
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },

    // Update name/phone after a profile edit without changing the tokens
    updateUser(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('authUser', JSON.stringify(state.user));
      }
    },
  },
});

export const { setCredentials, logout, setLoading, setError, updateUser } = authSlice.actions;
export default authSlice.reducer;
