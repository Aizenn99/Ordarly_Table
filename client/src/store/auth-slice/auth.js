import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = { // ✅ Fixed typo
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

export const registerUser = createAsyncThunk("auth/register", async (formdata) => {
  const response = await axios.post("http://localhost:8000/api/auth/register", formdata, {
    withCredentials: true,
  });
  return response.data;
});

export const loginUser = createAsyncThunk("auth/login", async (formdata) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/auth/login", // Make sure this is correct!
      formdata,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Login API Error:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  const response = await axios.post(
    "http://localhost:8000/api/auth/logout",
    {}, // Empty body
    { withCredentials: true } // Move here
  );
  return response.data;
});



export const checkAuth = createAsyncThunk("auth/check-auth", async () => { // ✅ Corrected asyncThunk name
  const response = await axios.get("http://localhost:8000/api/auth/check-auth", {
    withCredentials: true,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
  return response.data; // ✅ Return response data
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => { // ✅ Implemented setUser
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("Login Success:", action.payload);
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        console.log("Auth Check:", action.payload);
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      }).addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
