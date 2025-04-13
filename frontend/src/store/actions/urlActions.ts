import { createAsyncThunk } from "@reduxjs/toolkit";
import {axiosInstance} from "../../utils/axios";

// Define async action to shorten URL
export const shortenUrl = createAsyncThunk(
  "url/shortenUrl",
  async (payload: { originalUrl: string; expirationDate?: string; customAlias?: string }) => {
    try {
      const response = await axiosInstance.post(`${import.meta.env.VITE_BACKEND_URL}/url/shorten`, payload); // Your backend URL
      return response.data; // Should return { shortUrl, longUrl, createdAt, expiresAt, etc. }
    } catch (error) {
      throw new Error("Failed to shorten URL");
    }
  }
);
