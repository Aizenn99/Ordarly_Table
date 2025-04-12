import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addSpacesFormControls, addTableFormControls } from "@/config";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTable, getTable, updateTable } from "@/store/admin-slice/table";
import { toast } from "react-hot-toast";

const initialformData = {
  name: "",
  capacity: "",
  status: "",
  spaces: "",
};

const AdminTableQR = () => {
  const [openaddTable, setOpenAddTable] = useState(false);
  const [openaddSpaces, setOpenAddSpaces] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const [isopendown, setIsOpenDown] = useState(false);
  const { tables } = useSelector((state) => state.adminTable);
  const [formData, setFormData] = useState(initialformData);

  useEffect(() => {
    dispatch(getTable());
  }, [dispatch]);

  function onSubmit(e) {
    e.preventDefault();
    if (currentEditedId) {
      dispatch(updateTable({ id: currentEditedId, formData })).then((res) => {
        if (res.payload.success) {
          toast.success("Table Updated Successfully");
          setOpenAddTable(false);
          setFormData(initialformData);
        }
      });
    } else {
      dispatch(addTable(formData)).then((res) => {
        if (res.payload.success) {
          setFormData(initialformData);
          toast.success("Table Added Successfully");
          setOpenAddTable(false);
        }
      });
    }
  }

  const getOptionLabel = (name, id) => {
    const control = addTableFormControls.find((ctrl) => ctrl.name === name);
    return control?.options?.find((opt) => opt.id === id)?.label || id;
  };

  return (
    <div>
      <div className="flex items-center justify-between p-3 md:p-4">
        <h1 className="text-xl font-semibold ">Manage Table</h1>
        <div className="flex gap-2 items-center">
          <Sheet open={openaddTable} onOpenChange={setOpenAddTable}>
            <Button
              className="bg-primary1 hover:bg-primary1 rounded-lg"
              onClick={() => setOpenAddTable(true)}
            >
              Add Table
            </Button>
            <SheetContent className="w-96 overflow-y-scroll" side="right">
              <SheetHeader className="border-b">
                <SheetTitle className="font-semibold">Add Table</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 p-4">
                <CommonForm
                  formData={formData}
                  setformData={setFormData}
                  buttonText="Add"
                  formControls={addTableFormControls}
                  onSubmit={onSubmit}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Sheet open={openaddSpaces} onOpenChange={setOpenAddSpaces}>
            <Button
              className="bg-primary1 hover:bg-primary1 rounded-lg"
              onClick={() => setOpenAddSpaces(true)}
            >
              Add Spaces
            </Button>
            <SheetContent className="w-96 overflow-y-scroll" side="right">
              <SheetHeader className="border-b">
                <SheetTitle className="font-semibold">Add Spaces</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 p-4">
                <CommonForm
                  formData={formData}
                  setformData={setFormData}
                  buttonText="Add"
                  formControls={addSpacesFormControls}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="p-3 md:p-4 mt-4">
        <Collapsible open={isopendown} onOpenChange={setIsOpenDown}>
          <CollapsibleTrigger asChild>
            <div
              className="flex items-center justify-between gap-2 cursor-pointer"
              onClick={() => setIsOpenDown((prev) => !prev)}
            >
              <h1 className="flex items-center gap-2 mb-4 text-primary1">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {tables.length > 0 ? (
                tables.map((table, index) => {
                  const statusLabel = getOptionLabel("status", table.status);
                  const spacesLabel = getOptionLabel("spaces", table.spaces);

                  const cardColor =
                    statusLabel === "available"
                      ? "bg-green-200 border-primary1"
                      : statusLabel === "occupied"
                      ? "bg-red-200 border-red-600"
                      : statusLabel === "reserved"
                      ? "bg-blue-200 border-blue-600"
                      : "bg-gray-100";

                  return (
                    <div
                      key={index}
                      className={`card w-full p-3 rounded shadow border ${cardColor}`}
                    >
                      <h2 className="font-semibold text-lg text-center mb-2">
                        {table.tableName}
                      </h2>
                      <p className="text-sm text-center mb-2">
                        Capacity: {table.capacity}
                      </p>
                      <p className="text-sm text-center mb-2">
                        Status: {statusLabel}
                      </p>
                      
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
    </div>
  );
};

export default AdminTableQR;
