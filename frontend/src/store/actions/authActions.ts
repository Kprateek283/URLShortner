import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axios.ts";
import { setToken } from "../slices/authSlice.ts"; // Ensure you're using the correct slice

// Action to handle user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData: { email: string; password: string }, { rejectWithValue, dispatch }) => {
    try {
      // Sending login request to backend
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`, 
        formData,
        { withCredentials: true }
      );

      const { token } = response.data;

      // Store the token in Redux state
      dispatch(setToken(token));

      // Also store the token in localStorage for persistence
      localStorage.setItem("token", token);

      // Returning token (or other data you want)
      return response.data;
    } catch (err: any) {
      // Handling error and returning the error message
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);
