import React from "react";
import { FaLeaf } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { SlLogout } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice/auth";
import CurrentDate from "./date";

const StaffNavbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <div className="text-primary1 flex items-center gap-2">
        <FaLeaf size={24} />
        <span>Ordarly</span>
      </div>
      <div className="text-primary1  flex items-center gap-3">
        <IoNotifications size={24} className="text-primary1 cursor-pointer" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="w-8 h-8 flex items-center cursor-pointer justify-center">
              <AvatarFallback>
                {/* Placeholder for user initials or avatar fallback */}
                {user?.userName ? user.userName[0].toUpperCase() : ""}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="left" className="w-56">
            <DropdownMenuLabel className="flex items-center justify-center">
              {user?.userName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <SlLogout className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default StaffNavbar;
