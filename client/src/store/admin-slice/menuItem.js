import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  menuItem: [],
};

export const addMenuItem = createAsyncThunk(
  "admin/add-menu-item",
  async (formdata) => {
    const result = await axios.post("/api/admin/add-menu-item", formdata, {
      headers: {
        "Content-Type": "multipart/form-data , application/json",
      },
    });
    return result?.data;
  }
);

export const getMenuItem = createAsyncThunk("admin/get-menu-item", async () => {
  const result = await axios.get("/api/admin/get-menu-item", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return result?.data;
});

export const deleteMenuItem = createAsyncThunk(
  "admin/delete-menu-item",
  async (id) => {
    const result = await axios.delete(`/api/admin/delete-menu-item/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result?.data;
  }
);

export const updateMenuItem = createAsyncThunk(
  "admin/update-menu-item",
  async (formdata) => {
    const result = await axios.put(
      `/api/admin/update-menu-item/${id}`,
      formdata,
      {
        headers: {
          "Content-Type": "multipart/form-data , application/json",
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
        state.menuItem = action.payload;
      })
      .addCase(addMenuItem.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getMenuItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMenuItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.menuItem = action.payload;
      })
      .addCase(getMenuItem.rejected, (state) => {
        state.isLoading = false;
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