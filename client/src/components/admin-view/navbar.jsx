import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiMenu3Fill } from "react-icons/ri";
import { Button } from "../ui/button";
import { FaLeaf } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { Avatar, AvatarFallback } from "../ui/avatar";

const AdminNavbar = ({ setOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      {/* Logo */}
      <div className="text-primary1 flex items-center gap-2">
        <FaLeaf size={24} />
        <span>Ordarly</span>
      </div>

      {/* Menu Button (Visible only on small screens) */}
      <div className="text-primary1 lg:hidden flex items-center gap-3">
        <IoNotifications size={24} className="text-primary1 cursor-pointer" />
        <Avatar className="w-8 h-8 flex items-center cursor-pointer justify-center">
          <AvatarFallback>
            {user?.userName ? user.userName[0].toUpperCase() : ""}
          </AvatarFallback>
        </Avatar>
        <Button
          onClick={() => setOpen(true)}
          className=" bg-primary1 text-white"
        >
          <RiMenu3Fill size={24} />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </div>
      {/* Notification & Avatar */}
      <div className=" hidden lg:flex items-center gap-4 sm:ml-auto">
        <IoNotifications size={24} className="text-primary1 cursor-pointer" />
        <Avatar className="w-8 h-8 flex items-center cursor-pointer justify-center">
          <AvatarFallback>
            {user?.userName ? user.userName[0].toUpperCase() : ""}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default AdminNavbar;
