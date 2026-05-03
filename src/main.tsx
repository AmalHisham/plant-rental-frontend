import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.tsx';
import { store } from './store';

// Create one shared React Query instance for the entire app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // keep fetched data fresh for 5 minutes
      retry: 1, // retry a failed request once before showing an error
    },
  },
});

// Find the empty <div id="root"> in index.html and hand it to React
createRoot(document.getElementById('root')!).render(
  // Runs components twice in development to catch bugs early (no effect in production)
  <StrictMode>
    {/* Makes Redux store (login state, user info) available to every component */}
    <Provider store={store}>
      {/* Makes React Query cache (fetched plants, orders, etc.) available to every component */}
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
