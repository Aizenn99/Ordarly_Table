import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/auth";
import AdminmenuItemSlice from "./admin-slice/menuItem";
import AdminTableSlice from "./admin-slice/table";
import StaffCartSlice from "./staff-slice/cart"

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminMenuItem: AdminmenuItemSlice,
    adminTable: AdminTableSlice,
    staffCart: StaffCartSlice,
  },
});

export default store;
