import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../../store';
import { setCredentials, setError } from '../authSlice';
import type { AuthUser } from '../types';

// The backend redirects to /auth/callback?accessToken=...&refreshToken=...
// We decode the JWT payload to extract the user info stored in the token.
function parseJwtPayload(token: string): { id: string; role: string } | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)) as { id: string; role: string };
  } catch {
    return null;
  }
}

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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

    // Build a minimal user object from the JWT payload.
    // The backend stores { id, role } in the access token.
    const user: AuthUser = {
      _id: payload.id,
      name: '',      // not available in JWT — will be populated when profile is fetched
      email: '',
      role: payload.role as AuthUser['role'],
    };

    dispatch(setCredentials({ user, accessToken, refreshToken }));
    navigate('/', { replace: true });
  }, [dispatch, navigate, searchParams]);

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
