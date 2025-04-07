import InfoCard from "@/components/admin-view/menu/InfoCard";
import React, { useEffect, useState } from "react";
import { IoFastFoodOutline } from "react-icons/io5";
import { CiCircleList } from "react-icons/ci";
import { MdFilterList } from "react-icons/md";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ProductImageUpload from "@/components/admin-view/menu/ProductImageUpload";
import CommonForm from "@/components/common/form";
import { addMenuItemsFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { useToaster } from "react-hot-toast";
import {
  addMenuItem,
  deleteMenuItem,
  getMenuItem,
  updateMenuItem,
} from "@/store/admin-slice/menuItem";

const initialformData = {
  imageURL: null,
  title: "",
  description: "",
  category: "",
  subcategory: "",
  price: "",
};

const AdminMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [openMenu, setopenMenu] = useState(false);
  const [formData, setformData] = useState(initialformData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const { menuItem } = useSelector((state) => state.adminMenuItem);

  const dispatch = useDispatch();
  const toast = useToaster();

  function onSubmit() {
    currentEditedId
      ? dispatch(updateMenuItem({ formData, id: currentEditedId })).then(
          (res) => {
            if (res.payload.success) {
              toast.success("Menu Item Updated Successfully");
              setopenMenu(false);
            } else {
              toast.error(res.payload.message);
            }
          }
        )
      : dispatch(
          addMenuItem({
            ...formData,
            imageURL: formData.imageURL,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            subcategory: formData.subcategory,
            price: formData.price,
          })
        ).then((res) => {
          if (res.payload.success) {
            toast.success("Menu Item Added Successfully");
            setopenMenu(false);
          } else {
            toast.error(res.payload.message);
          }
        });
  }

  function handledelete(getcurrentMenuId) {
    dispatch(deleteMenuItem(getcurrentMenuId)).then((res) => {
      if (res.payload.success) {
        toast.success("Menu Item Deleted Successfully");
      } else {
        toast.error(res.payload.message);
      }
    });
  }

  useEffect(() => {
    dispatch(getMenuItem());
  }, [dispatch]);

  const SubCategorys = [
    { id: "1", name: "Starters" },
    { id: "2", name: "Main Course" },
    { id: "3", name: "Snacks" },
    { id: "4", name: "Soups" },
  ];

  const Categorys = [
    { id: "1", name: "Veg" },
    { id: "2", name: "Non-Veg" },
    { id: "3", name: "Dessert" },
    { id: "4", name: "Beverages" },
    { id: "5", name: "Salads" },
  ];

  useEffect(() => {
    if (!openMenu) {
      setformData(initialformData);
    }
  }, [openMenu]);

  const filteredMenuItem = menuItem.filter((item) => {
    const categoryMatch = selectedCategory
      ? item.category === selectedCategory
      : true;
    const subCatMatch = selectedSubCategory
      ? item.subcategory === selectedSubCategory
      : true;
    return categoryMatch && subCatMatch;
  });

  return (
    <>
      <div className="w-full h-full bg-[#E3F4F4] rounded-2xl p-4">
        {/* TOP CARDS */}
        <div className="w-full gap-3 justify-between grid md:grid-cols-3 grid-cols-1">
          <InfoCard
            icon={<IoFastFoodOutline />}
            color="bg-primary1"
            value={menuItem.length}
            label="Total Items"
          />
          <InfoCard
            icon={<CiCircleList />}
            color="bg-primary1"
            value={Categorys.length}
            label="Total Category"
          />
          <InfoCard
            icon={<MdFilterList />}
            color="bg-primary1"
            value={SubCategorys.length}
            label="Total Sub-Category"
          />
        </div>

        {/* CATEGORY AND SUBCATEGORY FILTERS */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 mt-10">
          {/* CATEGORY SIDEBAR */}
          <div className="w-full lg:w-36 md:w-40 bg-white p-4 rounded-lg max-h-[400px] overflow-y-scroll h-[160px] scrollbar-hide">
            <h2 className="font-semibold mb-2 text-md text-center">
              Categories
            </h2>
            <div className="flex flex-col gap-2">
              {Categorys.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    setSelectedCategory(
                      cat.name === selectedCategory ? null : cat.name
                    )
                  }
                  className={`px-2 py-1 rounded-md text-sm transition ${
                    selectedCategory === cat.name
                      ? "bg-primary1 text-white"
                      : "bg-[#E3F4F4] hover:bg-primary1 hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* SUBCATEGORY SCROLL */}
          <div className="md:w-full bg-white w-[350px] overflow-x-scroll  p-4 rounded-lg">
            <h2 className="font-semibold  text-xl mb-4">Sub Categories</h2>
            <div className="flex gap-4 overflow-x-auto">
              {SubCategorys.length === 0 && (
                <p className="text-sm text-gray-500">
                  No subcategories available.
                </p>
              )}
              {SubCategorys.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() =>
                    setSelectedSubCategory(
                      sub.name === selectedSubCategory ? null : sub.name
                    )
                  }
                  className={`min-w-[150px] whitespace-nowrap px-4 py-2 border rounded-lg transition shadow ${
                    selectedSubCategory === sub.name
                      ? "bg-primary1 text-white border-primary1"
                      : "bg-[#E3F4F4] text-primary1 border-primary1 hover:bg-primary1 hover:text-white"
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FILTERED MENU ITEMS */}
        <div className="mt-8 bg-white p-4 rounded-xl">
          <h2 className="font-semibold text-xl mb-4">Menu Items</h2>
          {filteredMenuItem.length === 0 ? (
            <p className="text-sm text-gray-500">
              No items match the selected filters.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {filteredMenuItem.map((item) => (
                <div
                  key={item._id}
                  className="bg-white shadow rounded-xl overflow-hidden relative"
                >
                  <img

                    src={item.imageURL || ""}
                    alt={item.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-3 text-left">
                    <h3 className="font-semibold text-md text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm text-black">
                        ₹ {item.price}
                      </span>
                      <button className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ➕ FLOATING ADD BUTTON */}
      <Sheet onOpenChange={setOpen} open={open}>
        <button
          onClick={() => setOpen(true)}
          type="button"
          className="fixed bottom-8 right-14 cursor-pointer z-50 bg-primary1 w-16 h-16 text-3xl text-white rounded-full shadow-lg flex items-center justify-center"
          title="Add New Item"
        >
          +
        </button>
        <SheetContent className="w-96" side="right">
          <SheetHeader className="border-b">
            <SheetTitle className="flex gap-2 mb-6">
              <span>Add Options</span>
            </SheetTitle>
          </SheetHeader>
          <div className="p-4 flex flex-col gap-2">
            <div
              onClick={() => setopenMenu(true)}
              className="card bg-[#E3F4F4] text-primary1 flex items-center justify-center cursor-pointer p-4 rounded-lg"
            >
              <span className="text-lg font-semibold ">Add Menu Items</span>
            </div>
            <div className="card bg-[#E3F4F4] text-primary1 flex items-center justify-center cursor-pointer p-4 rounded-lg">
              <span className="text-lg font-semibold ">Add Category</span>
            </div>
            <div className="card bg-[#E3F4F4] text-primary1 flex items-center justify-center cursor-pointer p-4 rounded-lg">
              <span className="text-lg font-semibold ">Add Sub-Category</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* SEPARATE SHEET FOR ADD MENU ITEMS */}
      <Sheet
        onOpenChange={setopenMenu}
        open={openMenu}
        setformData={initialformData}
      >
        <SheetContent className="w-96 overflow-y-scroll " side="right">
          <SheetHeader className="border-b">
            <SheetTitle className="flex gap-2 ">
              <span>Add Menu Items</span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 p-4">
            <ProductImageUpload
              setImageUrlInForm={(url) =>
                setformData((prev) => ({ ...prev, imageURL: url }))
              }
            />
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setformData={setformData}
              buttonText={"Add"}
              formControls={addMenuItemsFormControls}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AdminMenu;
