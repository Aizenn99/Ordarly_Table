// store/slices/staffBillSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  bills: [],
  selectedBill: null,
  isLoading: false,
  error: null,
};


export const generateBill = createAsyncThunk(
  "bill/generateBill",
  async ({ tableName, spaceName }, thunkAPI) => {
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/staff/bill/generate",
        { tableName, spaceName },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data.bill;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


// 2. Get All Bills
export const getAllBills = createAsyncThunk(
  "bill/getAllBills",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("http://localhost:8000/api/staff/bills");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// 3. Get Bill by Number
export const getBillByNumber = createAsyncThunk(
  "bill/getBillByNumber",
  async (billNumber, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/staff/bill/${billNumber}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// 4. Mark Bill as PAID
export const markBillAsPaid = createAsyncThunk(
  "bill/markBillAsPaid",
  async (billNumber, thunkAPI) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/staff/bill/mark-paid/${billNumber}`
      );
      return response.data.bill;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


// 5. Delete a Bill
export const deleteBill = createAsyncThunk(
  "bill/deleteBill",
  async (billNumber, thunkAPI) => {
    try {
      await axios.delete(`http://localhost:8000/api/staff/bill/${billNumber}`);
      return billNumber;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const staffBillSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    clearSelectedBill(state) {
      state.selectedBill = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateBill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateBill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bills.unshift(action.payload);
      })
      .addCase(generateBill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getAllBills.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bills = action.payload;
      })
      .addCase(getAllBills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getBillByNumber.fulfilled, (state, action) => {
        state.selectedBill = action.payload;
      })

      .addCase(markBillAsPaid.fulfilled, (state, action) => {
        const index = state.bills.findIndex(
          (b) => b.billNumber === action.payload.billNumber
        );
        if (index !== -1) {
          state.bills[index] = action.payload;
        }
      })

      .addCase(deleteBill.fulfilled, (state, action) => {
        state.bills = state.bills.filter(
          (b) => b.billNumber !== action.payload
        );
      });
  },
});

export const { clearSelectedBill } = staffBillSlice.actions;
export default staffBillSlice.reducer;
