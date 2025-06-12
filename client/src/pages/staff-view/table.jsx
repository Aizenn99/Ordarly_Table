import InfoCard from "@/components/admin-view/menu/InfoCard";
import CurrentDate from "@/components/staff-view/date";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { addTableFormControls } from "@/config";
import { getTable } from "@/store/admin-slice/table";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { IoMdPerson } from "react-icons/io";
import { Badge } from "@/components/ui/badge";

const StaffTable = () => {
  const dispatch = useDispatch();
  const [isopendown, setIsOpenDown] = useState(false);

  const getOptionLabel = (name, id) => {
    const control = addTableFormControls.find((ctrl) => ctrl.name === name);
    return control?.options?.find((opt) => opt.id === id)?.label || id;
  };

  const { tables } = useSelector((state) => state.adminTable);

  useEffect(() => {
    dispatch(getTable());
  }, [dispatch]);

  const availableTables = tables.filter(
    (table) => getOptionLabel("status", table.status) === "available"
  ).length;
  const occupiedTables = tables.filter(
    (table) => getOptionLabel("status", table.status) === "occupied"
  ).length;
  const reservedTables = tables.filter(
    (table) => getOptionLabel("status", table.status) === "reserved"
  ).length;

  return (
    <div className="p-3 md:p-4 mt-1  ">
      {/* Table Stats */}
      <div className="flex justify-end items-end mb-4">
        {" "}
        <span>
          <CurrentDate />
        </span>{" "}
      </div>

      <div className="w-full gap-3 mb-4 grid grid-cols-4 ">
        <div className="text-sm p-4 min-h-[70px] flex flex-col items-center justify-center rounded-2xl shadow-md shadow-gray-100 border border-yellow-600 bg-beige text-center whitespace-normal break-words">
          <h1>Total Tables</h1>
          <span className="text-xl text-yellow-600 mt-1 font-semibold">
            {tables.length}
          </span>
        </div>
        <div className="text-sm p-4 min-h-[70px] flex flex-col items-center justify-center rounded-2xl shadow-md shadow-gray-100 border border-primary1 bg-green-200 text-center whitespace-normal break-words">
          <h1>Available Tables</h1>
          <span className="text-xl mt-1  text-primary1 font-semibold">
            {availableTables}
          </span>
        </div>
        <div className="text-sm p-4 min-h-[70px] flex flex-col items-center justify-center rounded-2xl shadow-md shadow-gray-100 border border-red-600 bg-red-200 text-center whitespace-normal break-words">
          <h1>Occupied Tables</h1>
          <span className="text-xl mt-1   text-red-600 font-semibold">
            {occupiedTables}
          </span>
        </div>
        <div className="text-sm p-4 min-h-[70px] flex flex-col items-center justify-center rounded-2xl shadow-md shadow-gray-100 border border-blue-600 bg-blue-200 text-center whitespace-normal break-words">
          <h1>Reserved Tables</h1>
          <span className="text-xl mt-1  text-blue-600 font-semibold">
            {reservedTables}
          </span>
        </div>
      </div>

      {/* Floor Tables */}
      <Collapsible open={isopendown} onOpenChange={setIsOpenDown}>
        <CollapsibleTrigger asChild>
          <div
            className="flex items-center justify-between gap-2 cursor-pointer"
            onClick={() => setIsOpenDown((prev) => !prev)}
          >
            <h1 className="flex items-center gap-2 mb-4 text-primary1 font-semibold">
              1st Floor tables
              {isopendown ? (
                <FaChevronUp className="text-primary1" />
              ) : (
                <FaChevronDown className="text-primary1" />
              )}
            </h1>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {tables.length > 0 ? (
              tables.map((table, index) => {
                const statusLabel = getOptionLabel("status", table.status);
                const cardColor =
                  statusLabel === "available"
                    ? " border-primary1"
                    : statusLabel === "occupied"
                    ? " border-red-600"
                    : statusLabel === "reserved"
                    ? " border-blue-600"
                    : "bg-gray-100";

                return (
                  <div
                    key={index}
                    className={`cardB w-full p-3 rounded shadow border ${cardColor}`}
                  >
                    <h2 className="font-bold text-sm text-center mb-2">
                      {table.tableName}
                    </h2>
                    <p className="text-sm flex flex-inline justify-center  items-center gap-2 mb-2">
                      {/* <IoMdPerson /> */}
                      Size: {table.capacity}
                    </p>
                    <Badge
                      className={`text-sm mx-auto flex items-center justify-center   mb-2
                        ${
                          statusLabel === "available"
                            ? "bg-green-200 text-primary1"
                            : statusLabel === "occupied"
                            ? "bg-red-200 text-red-600"
                            : statusLabel === "reserved"
                            ? "bg-blue-200 text-blue-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                    >
                      {statusLabel}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground">No tables added yet.</p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default StaffTable;
