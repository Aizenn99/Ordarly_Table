import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminNavbar from "./navbar";

const AdminLayout = () => {
  const [openSideBar, setOpenSideBar] = useState(false);
  return (
    <div className="flex min-h-screen  w-full ">
      {/* admin SideBar */}
      <AdminSideBar open={openSideBar} setopen={setOpenSideBar} />
      <div className="flex flex-1 flex-col">
        {/* adminHeader */}
        <AdminNavbar setOpen={setOpenSideBar} />
        <main className="flex-1 flex-col flex p-4 md:p-6 " >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
