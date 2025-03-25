import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full ">
      <div className="hidden lg:flex items-center justify-center bg-primary1 w-1/2 px-12 ">
        <div className="max-w-md space-y-6 text-center text-primary">
          <h1 className="text-4xl font-semibold tracking-tight">
            Welcome to <span className="text-black">Ordarly</span>
          </h1>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
