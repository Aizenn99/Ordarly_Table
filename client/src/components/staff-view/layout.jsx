import React from "react";
import { Outlet } from "react-router-dom";
import StaffNavbar from "./navbar";
import StaffFooter from "./footer";

const StaffLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 flex flex-col">
        {/* Staff Header */}
        <StaffNavbar />
        <main className="flex-1 flex-col flex p-4 md:p-6">
          {/* This is where the staff content will be rendered */}
          <Outlet />
        </main>

        {/* Footer or additional components can be added here */}
        <footer className="border-t bg-white">
          <StaffFooter/>
        </footer>
      </div>
    </div>
  );
};

export default StaffLayout;
