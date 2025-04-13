import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { shortenUrl } from "../actions/urlActions"; 

interface UrlState {
  urls: Array<{ shortUrl: string; originalUrl: string; createdAt: string; expiresAt?: string }>;
  loading: boolean;
  error: string | null;
}

const initialState: UrlState = {
  urls: [],
  loading: false,
  error: null,
};

const urlSlice = createSlice({
  name: "url",
  initialState,
  reducers: {
    // Add any extra reducers if necessary
  },
  extraReducers: (builder) => {
    builder
      .addCase(shortenUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(shortenUrl.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.urls.push(action.payload); // Assuming the payload is the shortened URL object
      })
      .addCase(shortenUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error shortening URL";
      });
  },
});

export default urlSlice.reducer;
