// src/store/signupSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SignupState {
  name: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  error: string;
  loading: boolean;
  success: boolean;
  token: string | null;
}

const initialState: SignupState = {
  name: '',
  userName: '',
  email: '',
  password: '',
  confirmPassword: '',
  error: '',
  loading: false,
  success: false,
  token: null,
};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.confirmPassword = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = '';
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
  },
});

export const { 
  setName, 
  setEmail, 
  setPassword, 
  setConfirmPassword, 
  setError, 
  clearError,
  setLoading,
  setSuccess,
  setToken 
} = signupSlice.actions;

export default signupSlice.reducer;
