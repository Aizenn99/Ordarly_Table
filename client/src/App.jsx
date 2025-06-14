import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import { useEffect } from "react";
import CheckAuth from "./components/common/CheckAuth";
import { checkAuth } from "./store/auth-slice/auth";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import KitchenLayout from "./components/kitchen-view/layout";
import KitchenHome from "./pages/kitchen-view/home";
import KitchenSettings from "./pages/kitchen-view/settings";
import Loader from "./components/common/Loader";
import { Toaster } from "react-hot-toast";
import AdminOrders from "./pages/admin-view/orders";
import AdminMenu from "./pages/admin-view/menu";
import AdminTableQR from "./pages/admin-view/table-qr";
import AdminBills from "./pages/admin-view/bills";
import AdminSettings from "./pages/admin-view/settings";
import AdminReports from "./pages/admin-view/reports";
import AdminUpdate from "./pages/admin-view/update-help";
import AdminUser from "./pages/admin-view/user-access";
import StaffHome from "./pages/staff-view/home";
import StaffLayout from "./components/staff-view/layout";
import StaffTable from "./pages/staff-view/table";
import StaffMenu from "./pages/staff-view/menu";
import StaffBill from "./pages/staff-view/Bill";
import CustomerInfo from "./components/staff-view/CustomerInfo";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="table-qr" element={<AdminTableQR />} />
          <Route path="bills" element={<AdminBills />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="update-help" element={<AdminUpdate />} />
          <Route path="user-access" element={<AdminUser />} />
        </Route>

        <Route
          path="/kitchen"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <KitchenLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<KitchenHome />} />
          <Route path="settings" element={<KitchenSettings />} />
        </Route>

        <Route
          path="/staff"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <StaffLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<StaffHome />} />
          <Route path="table" element={<StaffTable/>} />
          <Route path="menu" element={<StaffMenu />} />
          <Route path="customer" element={<CustomerInfo />} />
          <Route path="bills" element={<StaffBill />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
