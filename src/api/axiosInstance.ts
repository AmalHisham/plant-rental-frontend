import axios from 'axios';

// One shared axios instance used by all API files.
// withCredentials lets cookies be sent cross-origin (not used yet, but good to have).
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

// Before every request: attach the saved access token so the user stays logged in.
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// After every response: if the server says "not authorised" (401), try refreshing the token once.
// _retry stops the retry from looping if the refresh itself also fails.
axiosInstance.interceptors.response.use(
  (response) => response, // success — return as-is

  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true; // don't retry the same request twice

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        // Use plain axios (not axiosInstance) so this interceptor doesn't trigger again.
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/refresh-token`,
          { refreshToken }
        );

        const newToken = data.data.accessToken;
        localStorage.setItem('accessToken', newToken);

        // Retry the original request with the new token.
        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(original);
      } catch {
        // Refresh failed — log the user out.
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error); // all other errors (400, 404, 500…) go to the caller
  }
);

export default axiosInstance;
