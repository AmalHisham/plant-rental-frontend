const DEFAULT_DEV_API_URL = 'http://localhost:5000';

const isProduction = import.meta.env.PROD;

export const getApiBaseUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL?.trim();

  if (apiUrl) return apiUrl;

  if (isProduction) {
    throw new Error('Missing VITE_API_URL in production. Set it to your deployed backend URL.');
  }

  return DEFAULT_DEV_API_URL;
};
