import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, // stores who is logged in (name, email, role, token)
  },
});

// Types for the store shape and dispatch function
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use these in components instead of the raw Redux hooks — they're pre-typed for this app
export const useAppDispatch = () => useDispatch<AppDispatch>(); // send an action to the store
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // read from the store
