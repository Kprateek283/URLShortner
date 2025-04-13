import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../actions/authActions";

// Define the initial state of the auth slice
interface AuthState {
  user: null | object;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState :AuthState= {
  token: localStorage.getItem("token") || null, // Load from localStorage if available
  // other state properties...
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload; // Store the token in Redux state
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {setToken } = authSlice.actions;
export default authSlice.reducer;
