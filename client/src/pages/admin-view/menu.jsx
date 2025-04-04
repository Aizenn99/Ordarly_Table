import InfoCard from "@/components/admin-view/menu/InfoCard";
import React from "react";
import { IoFastFoodOutline } from "react-icons/io5";
import { CiCircleList } from "react-icons/ci";
import { MdFilterList } from "react-icons/md";

const AdminMenu = () => {
  return (
    <div className="w-full h-full bg-[#E3F4F4] rounded-2xl p-4">
      {/* TOP TOTAL NUMBERS HERE */}
      <div className="w-full gap-3 justify-between grid md:grid-cols-3 grid-cols-1 ">
        <InfoCard
          icon={<IoFastFoodOutline />}
          color={"bg-primary1"}
          value={"10"}
          label={"Total Items"}
        />
        <InfoCard
          icon={<CiCircleList />}
          color={"bg-primary1"}
          value={"10"}
          label={"Total Category"}
        />
        <InfoCard
          icon={<MdFilterList />}
          color={"bg-primary1"}
          value={"10"}
          label={"Total Sub-Category"}
        />
      </div>
      <div className="flex justify-between " >
      <div className="w-35 bg-white mt-10 p-4 ">hello</div>
      </div>
     
    </div>
  );
};

export default AdminMenu;
