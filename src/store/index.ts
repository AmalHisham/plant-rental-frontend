import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import authReducer from '../features/auth/authSlice';

// configureStore automatically sets up Redux DevTools and redux-thunk middleware.
export const store = configureStore({
  reducer: {
    // auth slice holds the logged-in user's identity (id, name, email, role).
    // React Query handles all server cache (plants, cart, wishlist, orders) so
    // the Redux store is intentionally kept small — only truly global client state lives here.
    auth: authReducer,
  },
});

// RootState is the return type of store.getState().
// Used to type useSelector calls: useSelector((state: RootState) => state.auth)
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch includes the thunk middleware type so dispatch(thunkAction()) is typed correctly.
export type AppDispatch = typeof store.dispatch;

// Typed hook wrappers — use these instead of bare useDispatch/useSelector throughout the app
// to avoid manually typing the generic parameter on every call site.
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
