import {
  fetchCategories,
  fetchSubCategory,
  getMenuItem,
} from "@/store/admin-slice/menuItem";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuUtensils } from "react-icons/lu";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  addItemToCart,
  getCartByTable,
  removeItemFromCart,
} from "@/store/staff-slice/cart";
import { HiOutlineShoppingCart } from "react-icons/hi2";

const StaffMenu = () => {
  const { menuItem, menucategoris, subcats } = useSelector(
    (state) => state.adminMenuItem
  );
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantities, setQuantities] = useState(() => {
    const saved = localStorage.getItem("cart_quantities");
    return saved ? JSON.parse(saved) : {};
  });

  const [openCart, setopenCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    localStorage.setItem("cart_quantities", JSON.stringify(quantities));
  }, [quantities]);

  const dispatch = useDispatch();
  const { state } = useLocation();

  useEffect(() => {
    dispatch(getMenuItem());
    dispatch(fetchCategories());
    dispatch(fetchSubCategory());
  }, [dispatch]);

  useEffect(() => {
    if (state?.tableName) {
      dispatch(getCartByTable(state.tableName))
        .unwrap()
        .then((data) => setCart(data))
        .catch(() => toast.error("Failed to load cart"));
    }
  }, [dispatch, state?.tableName]);

  useEffect(() => {
    if (openCart && state?.tableName) {
      dispatch(getCartByTable(state.tableName))
        .unwrap()
        .then((res) => {
          setCart(res);
          setQuantities(() => {
            const initial = {};
            res.items.forEach((item) => {
              initial[item.itemId._id] = item.quantity;
            });
            return initial;
          });
        })
        .catch(() => toast.error("Failed to fetch cart"));
    }
  }, [openCart, state?.tableName, dispatch]);

  useEffect(() => {
    if (cart?.items?.length) {
      const initialQuantities = {};
      cart.items.forEach((item) => {
        initialQuantities[item.itemId._id] = item.quantity;
      });
      setQuantities(initialQuantities);
    }
  }, [cart]);

  useEffect(() => {
    if (!cart || cart.items === undefined) {
      const saved = localStorage.getItem("cart_quantities");
      if (saved) {
        setQuantities(JSON.parse(saved));
      }
    }
  }, [cart]);

  useEffect(() => {
    if (state?.tableName) {
      dispatch(getCartByTable(state.tableName))
        .unwrap()
        .then((data) => {
          if (data?.items?.length > 0) {
            setCart(data);
          }
        })
        .catch(() => toast.error("Failed to load cart"));
    }
  }, [state?.tableName]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setOpenMenu(true);
  };

  const handleAddClick = (id) => {
    if (!state?.tableName) {
      toast.error("Please select the table first");
      return;
    }

    setQuantities((prev) => ({ ...prev, [id]: 1 }));

    dispatch(
      addItemToCart({
        tableName: state.tableName,
        guestCount: state.guestCount,
        itemId: id,
        quantity: 1,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Item added");
        dispatch(getCartByTable(state.tableName))
          .unwrap()
          .then((updatedCart) => {
            setCart(updatedCart); // 🟢 update cart state here
            setCartItems(updatedCart.items || []); // 🟢 update visible items
          });
      })
      .catch(() => toast.error("Failed to add item"));
  };

  const handleIncrease = (id) => {
    const newQty = quantities[id] + 1;
    setQuantities((prev) => ({ ...prev, [id]: newQty }));

    dispatch(
      addItemToCart({
        tableName: state.tableName,
        guestCount: state.guestCount,
        itemId: id,
        quantity: newQty,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Quantity updated");
        dispatch(getCartByTable(state.tableName))
          .unwrap()
          .then((updatedCart) => {
            setCart(updatedCart);
            setCartItems(updatedCart.items || []);
          });
      })
      .catch(() => toast.error("Failed to update"));
  };

  const handleDecrease = (id) => {
    const newQty = quantities[id] - 1;

    if (newQty <= 0) {
      setQuantities((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      dispatch(
        removeItemFromCart({
          tableName: state.tableName,
          itemId: id,
        })
      )
        .unwrap()
        .then(() => {
          toast.success("Item removed");
          dispatch(getCartByTable(state.tableName))
            .unwrap()
            .then((updatedCart) => {
              setCart(updatedCart);
              setCartItems(updatedCart.items || []);
            });
        })
        .catch(() => toast.error("Failed to remove item"));
    } else {
      // 🟢 Handle decrease in quantity
      setQuantities((prev) => ({ ...prev, [id]: newQty }));

      dispatch(
        addItemToCart({
          tableName: state.tableName,
          guestCount: state.guestCount,
          itemId: id,
          quantity: newQty,
        })
      )
        .unwrap()
        .then(() => {
          toast.success("Quantity decreased");
          dispatch(getCartByTable(state.tableName))
            .unwrap()
            .then((updatedCart) => {
              setCart(updatedCart);
              setCartItems(updatedCart.items || []);
            });
        })
        .catch(() => toast.error("Failed to update quantity"));
    }
  };

  const filteredMenuItem = Array.isArray(menuItem)
    ? menuItem.filter((item) => {
        const categoryMatch = selectedCategory
          ? menucategoris.find((c) => c._id === item.category)?.name ===
            selectedCategory
          : true;

        const subCatMatch = selectedSubCategory
          ? subcats.find((s) => s._id === item.subcategory)?.name ===
            selectedSubCategory
          : true;

        return categoryMatch && subCatMatch;
      })
    : [];

  const totalItems = cart?.items?.length || 0;



  return (
    <>
      <div className="p-3 md:p-1">
        {state?.tableName && (
          <div className="flex p-3 md:p-1 justify-between bg-gray-100 border-b mb-3 rounded-2xl items-center">
            <span className="text-sm font-semibold text-black">
              Table | <span className="text-primary1">{state.tableName}</span>
            </span>
            <span className="text-sm font-semibold text-black">
              Guest | <span className="text-primary1">{state.guestCount}</span>
            </span>
          </div>
        )}

        <div className="flex flex-col bg-gray-100 rounded-2xl border p-1 gap-4">
          <div className="w-full max-w-[380px] sm:max-w-full">
            <h2 className="font-semibold sticky top-0 z-9 text-md bg-gray-100 p-1 px-4">
              Categories
            </h2>
            <div className="overflow-x-auto scrollbar-hide w-full">
              <div className="flex gap-3 px-2 w-max">
                {menucategoris.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() =>
                      setSelectedCategory(
                        cat.name === selectedCategory ? null : cat.name
                      )
                    }
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm shadow transition whitespace-nowrap ${
                      selectedCategory === cat.name
                        ? "bg-primary1 text-white"
                        : "bg-[#E3F4F4] text-black"
                    }`}
                  >
                    {cat.icon ? (
                      <img src={cat.icon} alt={cat.name} className="w-5 h-5" />
                    ) : (
                      <LuUtensils className="w-5 h-5" />
                    )}
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full max-w-[380px] sm:max-w-full">
            <h2 className="font-semibold sticky top-0 z-9 text-md p-1 bg-gray-100 px-4">
              Sub Categories
            </h2>
            <div className="overflow-x-auto scrollbar-hide w-full">
              <div className="flex gap-3 px-2 pb-2 w-max">
                {subcats.map((sub) => (
                  <button
                    key={sub._id}
                    onClick={() =>
                      setSelectedSubCategory(
                        sub.name === selectedSubCategory ? null : sub.name
                      )
                    }
                    className={`p-2 rounded-lg text-sm shadow transition whitespace-nowrap border ${
                      selectedSubCategory === sub.name
                        ? "bg-primary1 text-white border-primary1"
                        : "bg-[#E3F4F4] text-primary1 border-primary1"
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl mt-4">
          <h2 className="font-semibold text-xl mb-4 ml-4">Menu Items</h2>
          {filteredMenuItem.length === 0 ? (
            <p className="text-sm text-gray-500">
              No items match the selected filters.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 bg-gray-100 p-2 rounded-2xl md:grid-cols-4 gap-6">
              {filteredMenuItem.map((item) => (
                <div
                  key={item._id}
                  className="cursor-pointer bg-[#E3F4F4] shadow-lg rounded-xl max-h-[280px] min-h-[280px] flex flex-col overflow-hidden"
                >
                  <img
                    onClick={() => handleItemClick(item)}
                    src={item.imageURL || "/placeholder.png"}
                    alt={item.title || "Item"}
                    className="w-full h-36 object-cover rounded-t-xl"
                  />
                  <div className="p-3 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-semibold text-md text-gray-800 mb-1">
                        {item.title}
                      </h3>
                      <div className="text-sm text-gray-600 overflow-y-auto h-[45px] pr-1 scrollbar-hide">
                        {item.description}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-semibold text-sm text-black">
                        ₹ {item.price}
                      </span>
                      {quantities[item._id] ? (
                        <div className="flex items-center gap-1">
                          <button
                            className="bg-red-500 text-white w-6 h-6 rounded-full"
                            onClick={() => handleDecrease(item._id)}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            value={quantities[item._id]}
                            readOnly
                            className="w-8 text-center text-sm bg-transparent border-none outline-none"
                          />
                          <button
                            className="bg-red-500 text-white w-6 h-6 rounded-full"
                            onClick={() => handleIncrease(item._id)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
                          onClick={() => handleAddClick(item._id)}
                        >
                          ADD
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

     <div className="fixed bottom-26 right-6 z-50">
  <button
    onClick={() => setopenCart(true)}
    className="relative border flex items-center justify-center bg-gray-200 text-primary1 rounded-full w-14 h-14 text-3xl shadow-lg"
    title="View Cart"
  >
    <HiOutlineShoppingCart />
    
    {totalItems > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
        {totalItems}
      </span>
    )}
  </button>
</div>
      <Sheet onOpenChange={setopenCart} open={openCart}>
        <SheetContent className="w-96" side="right">
          <SheetHeader className="  ">
            <div className="flex items-center mt-8 justify-between">
              <span className="text-sm font-semibold text-black">
                Table |<span className="text-primary1">{state?.tableName}</span>
              </span>
              <span className="text-sm font-semibold text-black">
                Guest |
                <span className="text-primary1">{state?.guestCount}</span>
              </span>
            </div>
            <div className=" mt-3 flex items-center justify-center gap-2 ">
              Items Cart <HiOutlineShoppingCart />{" "}
            </div>
          </SheetHeader>

          <div className="flex flex-col gap-4 p-3">
            {!cart?.items || cart.items.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">
                No items in cart.
              </p>
            ) : (
              cart.items.map((cartItem) => {
                const menuData = menuItem.find(
                  (i) =>
                    i._id === cartItem.itemId._id || i._id === cartItem.itemId
                );
                if (!menuData) return null;
                const category = menucategoris.find(
                  (cat) => cat._id === menuData.category
                );

                
                return (
                  <div
                    key={cartItem._id}
                    className="bg-gray-100 p-3 rounded-xl shadow flex flex-col"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-md flex items-center justify-center gap-3 font-semibold text-gray-800">
                        {category?.icon ? (
                          <img
                            src={category.icon}
                            alt={category.name}
                            className="w-4 h-4"
                          />
                        ) : (
                          <LuUtensils className="w-4 h-4" />
                        )}
                        {menuData.title}
                      </span>
                    
                      <span className="text-sm font-semibold text-black">
                        Qty: {cartItem.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1 text-sm text-gray-600">
                      <span>₹ {menuData.price}</span>
                      <span className="text-black font-medium">
                        ₹ {menuData.price * cartItem.quantity}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet onOpenChange={setOpenMenu} open={openMenu}>
        <SheetContent
          className="h-2/3 rounded-t-xl p-3 bg-[#E3F4F4]"
          side="bottom"
        >
          {selectedItem && (
            <div className="flex flex-col h-full gap-3">
              <div className="bg-white rounded-xl p-4">
                <img
                  src={selectedItem.imageURL || "/placeholder.png"}
                  alt={selectedItem.title}
                  className="w-full h-54 object-cover rounded-3xl"
                />
                <div className="flex items-center gap-2 mt-3">
                  {(() => {
                    const category = menucategoris.find(
                      (cat) => cat._id === selectedItem.category
                    );
                    return category ? (
                      <>
                        {category.icon ? (
                          <img
                            src={category.icon}
                            alt={category.name}
                            className="w-6 h-6"
                          />
                        ) : (
                          <LuUtensils className="w-5 h-5" />
                        )}
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                      </>
                    ) : null;
                  })()}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <h2 className="text-xl font-bold">{selectedItem.title}</h2>
                  <span className="text-lg font-semibold text-primary1">
                    ₹ {selectedItem.price}
                  </span>
                </div>
                <p className="text-sm text-gray-600 overflow-y-auto scrollbar-hide mt-1 max-h-[100px]">
                  {selectedItem.description}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 h-full max-h-400"></div>
              <button className="mt-auto bg-primary1 text-white py-2 px-4 rounded-lg">
                Add to Cart
              </button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default StaffMenu;
