import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/auth";
import AdminmenuItemSlice from "./admin-slice/menuItem";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminMenuItem: AdminmenuItemSlice,
  },
});

export default store;
