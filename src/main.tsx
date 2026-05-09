import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.tsx';
import { store } from './store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // treat fetched data as fresh for 5 minutes
      retry: 1,                  // retry a failed request once before showing an error
    },
  },
});

createRoot(document.getElementById('root')!).render(
  // StrictMode renders components twice in development to surface bugs early
  <StrictMode>
    {/* Provider makes the Redux store (auth state) available everywhere */}
    <Provider store={store}>
      {/* QueryClientProvider makes the React Query cache available everywhere */}
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
