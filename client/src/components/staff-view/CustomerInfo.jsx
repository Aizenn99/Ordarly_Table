import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { fetchSpaces, getTable } from "@/store/admin-slice/table";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

const CustomerInfo = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [guestCount, setGuestCount] = useState(0);

  const tableCapacity = state?.capacity || 0;

  useEffect(() => {
    dispatch(getTable());
    dispatch(fetchSpaces());

    // Load guest count from localStorage if it exists
    const storedGuestCount = localStorage.getItem("guestCount");
    if (storedGuestCount) {
      setGuestCount(parseInt(storedGuestCount));
    }
  }, [dispatch]);

  const incrementGuest = () => {
    if (guestCount < tableCapacity) {
      setGuestCount(guestCount + 1);
    } else {
      toast.error("Maximum capacity reached!");
    }
  };

  const decrementGuest = () => {
    if (guestCount > 0) {
      setGuestCount(guestCount - 1);
    }
  };

  const handleSubmit = () => {
    if (guestCount === 0) {
      toast.error("Guest count must be at least 1");
      return;
    }

    toast.success(`Guest count of ${guestCount} added!`);

    // Save to localStorage
    localStorage.setItem(
      "guestInfo",
      JSON.stringify({
        tableName: state?.tableName,
        guestCount: guestCount,
      })
    );

    navigate("/staff/menu", {
      state: {
        guestCount: guestCount,
        tableName: state?.tableName,
        spaceName: state?.spaceName,
      },
    });

    setGuestCount(0);
  };

  return (
    <div className="flex flex-col h-screen p-3">
      <h1 className="text-2xl font-bold mb-2">Add Guest Count</h1>

      <div className="mb-3 flex flex-col gap-1 items-center mt-3">
        <span className="text-lg font-semibold">
          Table | {state?.tableName}
        </span>
        <span className="text-sm text-gray-500">
          Space | {state?.spaceName}
        </span>
        <span className="text-xs text-muted">Capacity: {tableCapacity}</span>
      </div>

      <div className="flex flex-col gap-4 mt-4 max-w-sm mx-auto w-full">
        <div className="flex flex-col gap-2">
          <label htmlFor="guestCount" className="text-sm font-semibold">
            Guest Count
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={decrementGuest}
              className="bg-gray-200 hover:bg-gray-300 text-lg py-2 rounded w-full"
            >
              -
            </button>
            <input
              type="number"
              value={guestCount}
              readOnly
              className="text-center border border-gray-300 rounded-lg p-2"
            />
            <button
              onClick={incrementGuest}
              className="bg-gray-200 hover:bg-gray-300 text-lg py-2 rounded w-full"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-primary1 text-white px-4 py-3 rounded-lg hover:bg-primary2 transition-colors w-full"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CustomerInfo;
