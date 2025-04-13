// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import signupReducer from './slices/signupSlice';
import authReducer from './slices/authSlice.ts';
import urlReducer from './slices/urlSlice.ts';
import analyticsReducer from './slices/analyticsSlice.ts';

export const store = configureStore({
  reducer: {
    signup: signupReducer,
    auth: authReducer, 
    url: urlReducer,
    analytics: analyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
