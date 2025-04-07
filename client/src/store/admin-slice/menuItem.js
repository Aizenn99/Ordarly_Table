import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  menuItem: [],
};

export const addMenuItem = createAsyncThunk(
  "admin/add-menu-item",
  async (formdata) => {
    const result = await axios.post(
      "http://localhost:8000/api/admin/add-menu",
      formdata,
      
    );
    return result?.data;
  }
);

export const getMenuItem = createAsyncThunk("admin/get-menu-item", async () => {
  const result = await axios.get("http://localhost:8000/api/admin/fetch-menu", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  return result?.data;
});

export const deleteMenuItem = createAsyncThunk(
  "admin/delete-menu-item",
  async (id) => {
    const result = await axios.delete(
      `http://localhost:8000/api/admin/delete-menu/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data;
  }
);

export const updateMenuItem = createAsyncThunk(
  "admin/update-menu-item",
  async ({ id, formdata }) => {
    const result = await axios.put(
      `http://localhost:8000/api/admin/update-menu/${id}`,
      formdata,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return result?.data;
  }
);

export const AdminmenuItemSlice = createSlice({
  name: "adminMenuItem",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addMenuItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.menuItem = action.payload.listOfMenuItems;
      })
      .addCase(addMenuItem.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getMenuItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMenuItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.menuItem = action.payload.listOfMenuItems;
      })
      .addCase(getMenuItem.rejected, (state) => {
        state.isLoading = false;
        state.menuItem = [];
      })
      .addCase(deleteMenuItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.menuItem = action.payload;
      })
      .addCase(deleteMenuItem.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateMenuItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.menuItem = action.payload;
      })
      .addCase(updateMenuItem.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default AdminmenuItemSlice.reducer;
