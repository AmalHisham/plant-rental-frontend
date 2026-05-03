import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import authReducer from '../features/auth/authSlice';

// configureStore automatically sets up Redux DevTools and redux-thunk middleware.
export const store = configureStore({
  reducer: {
    // auth slice holds the logged-in user's identity (id, name, email, role).
    auth: authReducer,
  },
});

// The shape of everything inside the store (e.g. state.auth)
export type RootState = ReturnType<typeof store.getState>;

// The type of the dispatch function (used to send actions to the store)
export type AppDispatch = typeof store.dispatch;

// Use these two hooks in components instead of the raw Redux ones —
// they already know the store's shape so TypeScript won't complain
export const useAppDispatch = () => useDispatch<AppDispatch>(); // to update the store
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // to read from the store
