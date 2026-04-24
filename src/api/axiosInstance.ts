import axios from 'axios';

// Single shared Axios instance used by every feature API module.
// withCredentials: true sends cookies cross-origin (required if cookies are ever used;
// currently the app uses Authorization headers, but this ensures forward compatibility).
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

// ── Request interceptor ───────────────────────────────────────────────────────
// Attaches the access token from localStorage to every outgoing request so
// individual API functions don't need to read localStorage themselves.
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ──────────────────────────────────────────────────────
// Handles 401 responses with a single transparent token refresh attempt.
// _retry flag on the original config prevents an infinite retry loop if the
// refresh endpoint itself returns 401 (expired/invalid refresh token).
axiosInstance.interceptors.response.use(
  (response) => response, // pass through successful responses unchanged

  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true; // mark so we don't retry the same request twice

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        // Use a raw axios call (not axiosInstance) to avoid triggering this interceptor again.
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/refresh-token`,
          { refreshToken }
        );

        const newToken = data.data.accessToken;
        localStorage.setItem('accessToken', newToken);

        // Update the Authorization header on the original failed request and retry it.
        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(original);
      } catch {
        // Refresh failed — clear tokens and send the user to login.
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
