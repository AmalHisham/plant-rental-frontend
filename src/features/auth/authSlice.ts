import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AuthUser } from './types';

// What the backend sends back after a successful login — all three fields must be present
interface SetCredentialsPayload {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}


const loadFromStorage = (): Pick<AuthState, 'user' | 'accessToken' | 'isAuthenticated'> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const userRaw = localStorage.getItem('authUser'); // raw string of user object (name, email, role) — JSON.parse converts it back to an object below
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

// Start with whatever was saved in localStorage (so the user stays logged in after refresh)
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

    // show or hide the loading spinner on login/register forms
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload; // true = show spinner, false = hide spinner
    },

    // save the error message and stop the loading spinner at the same time
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },

    // update the user's info (name, phone) after a profile edit — without touching the tokens
    updateUser(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }; // merge old user fields with the updated ones
        localStorage.setItem('authUser', JSON.stringify(state.user)); // keep localStorage in sync
      }
    },
  },
});

export const { setCredentials, logout, setLoading, setError, updateUser } = authSlice.actions;
export default authSlice.reducer;
