import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../../store';
import { setCredentials, setError } from '../authSlice';
import type { AuthUser } from '../types';

// The backend redirects to /auth/callback?accessToken=...&refreshToken=...
// after a successful Google OAuth flow. This page reads those params, rebuilds the
// user session, and navigates away immediately.

// The backend stores { id, role } in the JWT payload. We decode it client-side
// so we can set Redux state without a second API call (no token verification needed
// here — axiosInstance interceptors handle that on actual API calls).
function parseJwtPayload(token: string): { id: string; role: string } | null {
  try {
    // JWT structure: header.payload.signature — all base64url-encoded.
    // We only need the payload (index 1). Replace - and _ to convert from base64url to base64.
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)) as { id: string; role: string };
  } catch {
    return null; // malformed token
  }
}

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // processed ref prevents the effect from running twice in React StrictMode (double-invoke).
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const oauthError = searchParams.get('error');

    if (oauthError || !accessToken || !refreshToken) {
      dispatch(setError('Google sign-in failed. Please try again.'));
      navigate('/login?error=oauth_failed', { replace: true });
      return;
    }

    const payload = parseJwtPayload(accessToken);
    if (!payload) {
      dispatch(setError('Invalid token received.'));
      navigate('/login?error=oauth_failed', { replace: true });
      return;
    }

    // Build a minimal AuthUser from the JWT payload.
    // name and email are blank here because the JWT doesn't contain them.
    // They will be fetched from the profile endpoint when the user visits a page that needs them.
    const user: AuthUser = {
      _id: payload.id,
      name: '',
      email: '',
      role: payload.role as AuthUser['role'],
    };

    dispatch(setCredentials({ user, accessToken, refreshToken }));
    // replace: true removes the callback URL from the history stack so the user
    // can't navigate "back" to this page after being redirected.
    navigate('/', { replace: true });
  }, [dispatch, navigate, searchParams]);

  // Spinner shown while the redirect/dispatch is in progress.
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <svg
          className="animate-spin h-10 w-10 text-green-600 mx-auto mb-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-gray-500 text-sm">Signing you in…</p>
      </div>
    </div>
  );
}
