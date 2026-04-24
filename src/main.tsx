import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.tsx';
import { store } from './store';

// QueryClient is created once and shared across the entire app.
// staleTime: 5 minutes — data fetched by React Query is kept fresh for 5 minutes
// before it is considered stale and re-fetched on the next mount.
// retry: 1 — failed queries are retried once before showing an error.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

// Provider order matters: Redux Provider wraps QueryClientProvider so that
// query callbacks (e.g. in authSlice side-effects) can access the Redux store.
// document.getElementById('root')! — the non-null assertion is safe because index.html
// always has <div id="root">.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Provider makes the Redux store available to all descendant components via useSelector/useDispatch */}
    <Provider store={store}>
      {/* QueryClientProvider makes the React Query cache available via useQuery/useMutation */}
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
