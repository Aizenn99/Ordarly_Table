import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/AuthLayout";
import { useDispatch } from "react-redux";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";

function App() {
  //   const { user, isAuthenticated, isLoading } = useSelector(
  //     (state) => state.auth
  //   );
  //   const dispatch = useDispatch();

  //   useEffect(() => {
  //     dispatch(checkAuth());
  //   }, [dispatch]);

  //   if (isLoading) {
  //     return <div>Loading...</div>;
  //   }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
