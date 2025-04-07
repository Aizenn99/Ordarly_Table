import InfoCard from "@/components/admin-view/menu/InfoCard";
import React, { useState } from "react";
import { IoFastFoodOutline } from "react-icons/io5";
import { CiCircleList } from "react-icons/ci";
import { MdFilterList } from "react-icons/md";

const AdminMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

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

  const menuItems = [
    {
      id: "1",
      img: "https://www.indianveggiedelight.com/wp-content/uploads/2021/08/air-fryer-paneer-tikka-featured.jpg",
      name: "Paneer Tikka",
      category: "Veg",
      subcategory: "Starters",
      price: 180,
      description: "Grilled cottage cheese with Indian spices",
    },
    {
      id: "2",
      img: "https://www.thespruceeats.com/thmb/y6gT4wgjN5E4l-LNRGM8mrrpHPs=/4602x3068/filters:fill(auto,1)/traditional-chicken-wings-912937-hero-01-6c1a003373a54538a732abc0005145d8.jpg",
      name: "Chicken Wings",
      category: "Non-Veg",
      subcategory: "Starters",
      price: 220,
      description: "Spicy and crispy chicken wings",
    },
    {
      id: "3",
      img: "https://i1.wp.com/vegecravings.com/wp-content/uploads/2017/03/samosa-recipe-step-by-step-instructions.jpg?fit=1801%2C1717&ssl=1",
      name: "Veg Samosa",
      category: "Veg",
      subcategory: "Snacks",
      price: 40,
      description: "Crispy pastry filled with spiced potatoes",
    },
    {
      id: "4",
      name: "Chocolate Cake",
      category: "Dessert",
      subcategory: "Main Course",
      price: 120,
      description: "Rich and moist chocolate layered cake",
    },
    {
      id: "5",
      name: "Lemonade",
      category: "Beverages",
      subcategory: "Soups",
      price: 60,
      description: "Refreshing drink with lemon and mint",
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
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
            value={menuItems.length}
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
          {filteredMenuItems.length === 0 ? (
            <p className="text-sm text-gray-500">
              No items match the selected filters.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white shadow rounded-xl overflow-hidden relative"
                >
                  <img
                    src={item.img || "https://via.placeholder.com/150"}
                    alt={item.name}
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
      <button
        className="fixed bottom-8 right-14 z-50 bg-primary1 w-16 h-16 text-3xl text-white rounded-full shadow-lg flex items-center justify-center"
        title="Add New Item"
      >
        +
      </button>
    </>
  );
};

export default AdminMenu;
