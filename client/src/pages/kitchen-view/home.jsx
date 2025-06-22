import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchKitchenOrders } from "@/store/kitchen-slice/order-slice";
import io from "socket.io-client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import CurrentDate from "@/components/staff-view/date";

// ✅ Create socket outside component
const socket = io("http://localhost:8000", {
  transports: ["websocket"],
  withCredentials: true,
});

const KitchenHome = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.kitchenOrder);
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    dispatch(fetchKitchenOrders());

    // ✅ Socket event listener
    socket.on("new-kot", (newOrder) => {
      console.log("🟢 New KOT received:", newOrder);
      dispatch(fetchKitchenOrders());
    });

    // ✅ Clean up on unmount
    return () => {
      socket.off("new-kot");
    };
  }, [dispatch]);

  const handleItemCheck = (orderId, itemIndex, checked) => {
    setSelectedItems((prev) => {
      const updated = { ...prev };
      if (!updated[orderId]) updated[orderId] = new Set();
      if (checked) updated[orderId].add(itemIndex);
      else updated[orderId].delete(itemIndex);
      return { ...updated };
    });
  };

  const handleSelectAll = (orderId, totalItems) => {
    const allIndexes = new Set([...Array(totalItems).keys()]);
    setSelectedItems((prev) => ({ ...prev, [orderId]: allIndexes }));
  };

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <CurrentDate />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-yellow-100 border border-yellow-400 rounded-xl text-center py-4 shadow">
          <p className="font-semibold">Total Orders</p>
          <p className="text-2xl">{orders.length}</p>
        </div>
        <div className="bg-green-100 border border-green-400 rounded-xl text-center py-4 shadow">
          <p className="font-semibold">Served</p>
          <p className="text-2xl">
            {orders.filter((o) => o.status === "ready").length}
          </p>
        </div>
        <div className="bg-red-100 border border-red-400 rounded-xl text-center py-4 shadow">
          <p className="font-semibold">To Be Prepared</p>
          <p className="text-2xl">
            {orders.filter((o) => o.status !== "ready").length}
          </p>
        </div>
      </div>

      {/* Orders Accordion */}
      <Accordion type="multiple" className="space-y-4">
        {orders.map((orderItem) => (
          <AccordionItem key={orderItem._id} value={orderItem._id}>
            <div className="rounded-xl border shadow px-4 py-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Order #{orderItem.kotNumber}</p>
                  <p className="text-sm">Staff | {orderItem.username}</p>
                  <p className="text-sm">
                    Table {orderItem.tableName} • {orderItem.guestCount} guests
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      orderItem.status === "ready"
                        ? "bg-green-200 text-green-700"
                        : "bg-red-200 text-red-700"
                    }`}
                  >
                    Status: {orderItem.status.toUpperCase()}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Created:{" "}
                    {new Date(orderItem.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <AccordionTrigger className="w-full justify-center mt-3">
                Show Items
              </AccordionTrigger>

              <AccordionContent>
                <div className="py-2">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium">Items</p>
                    <button
                      className="text-xs underline"
                      onClick={() =>
                        handleSelectAll(orderItem._id, orderItem.items.length)
                      }
                    >
                      Select All
                    </button>
                  </div>

                  {orderItem.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm items-center py-1 border-b"
                    >
                      <span className="w-3/5">
                        {index + 1}. {item.itemName}
                      </span>
                      <span className="text-center w-1/5">
                        {item.quantity}
                      </span>
                      <Checkbox
                        checked={
                          selectedItems[orderItem._id]?.has(index) || false
                        }
                        onCheckedChange={(checked) =>
                          handleItemCheck(orderItem._id, index, checked)
                        }
                      />
                    </div>
                  ))}

                  <div className="mt-4 flex gap-3">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Prepared
                    </Button>
                    <Button variant="destructive">Delete</Button>
                  </div>
                </div>
              </AccordionContent>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default KitchenHome;
