import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  getAllBillsAdmin } from "@/store/staff-slice/Bill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { subDays, isSameDay, isWithinInterval } from "date-fns";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import io from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_URL}`); // Replace with your backend URL if deployed

const AdminBills = () => {
  const dispatch = useDispatch();
  const { bills } = useSelector((state) => state.staffBill);

  const [filteredBills, setFilteredBills] = useState([]);
  const [dateFilter, setDateFilter] = useState(
    localStorage.getItem("billDateFilter") || "today"
  );
  const [customRange, setCustomRange] = useState(() => {
    const storedRange = localStorage.getItem("billCustomRange");
    return storedRange ? JSON.parse(storedRange) : { from: null, to: null };
  });

  useEffect(() => {
    socket.on("bill-paid", (updatedBill) => {
      dispatch(getAllBillsAdmin()); // ✅ re-fetch bills when a bill is marked as PAID
      // Optionally show toast
      toast.success(`Bill #${updatedBill.billNumber} marked as PAID ✅`);
    });

    return () => {
      socket.off("bill-paid");
    };
  }, []);
  // Load all bills initially
  useEffect(() => {
    dispatch(getAllBillsAdmin());
  }, [dispatch]);

  // Socket listener for new bills
  useEffect(() => {
    socket.on("new-bill", () => {
      dispatch(getAllBillsAdmin()); // Fetch new bills without manual refresh
    });

    return () => {
      socket.off("new-bill");
    };
  }, [dispatch]);

  // Apply filter when bills change or filter changes
  useEffect(() => {
    if (!bills) return;
    const today = new Date();
    let filtered = [];

    switch (dateFilter) {
      case "today":
        filtered = bills.filter((bill) =>
          isSameDay(new Date(bill.createdAt), today)
        );
        break;
      case "yesterday":
        const yesterday = subDays(today, 1);
        filtered = bills.filter((bill) =>
          isSameDay(new Date(bill.createdAt), yesterday)
        );
        break;
      case "last7":
        filtered = bills.filter((bill) =>
          isWithinInterval(new Date(bill.createdAt), {
            start: subDays(today, 6),
            end: today,
          })
        );
        break;
      case "last30":
        filtered = bills.filter((bill) =>
          isWithinInterval(new Date(bill.createdAt), {
            start: subDays(today, 29),
            end: today,
          })
        );
        break;
      case "custom":
        if (customRange.from && customRange.to) {
          filtered = bills.filter((bill) =>
            isWithinInterval(new Date(bill.createdAt), {
              start: customRange.from,
              end: customRange.to,
            })
          );
        }
        break;
      default:
        filtered = bills;
    }

    setFilteredBills(filtered);
  }, [bills, dateFilter, customRange]);

  // Update localStorage when filter changes
  useEffect(() => {
    localStorage.setItem("billDateFilter", dateFilter);
  }, [dateFilter]);

  useEffect(() => {
    localStorage.setItem("billCustomRange", JSON.stringify(customRange));
  }, [customRange]);

  const handleExcelDownload = () => {
    alert("Excel generation logic goes here");
  };

  return (
    <div className="p-2 space-y-4">
      {/* NAVBAR FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left side filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {/* Date Buttons */}
          <div className="hidden sm:flex flex-wrap gap-2">
            {[
              { label: "Today", value: "today" },
              { label: "Yesterday", value: "yesterday" },
              { label: "Last 7 Days", value: "last7" },
              { label: "Last 30 Days", value: "last30" },
            ].map((item) => (
              <Button
                key={item.value}
                variant={dateFilter === item.value ? "default" : "outline"}
                onClick={() => setDateFilter(item.value)}
              >
                {item.label}
              </Button>
            ))}
            <CalendarDateRangePicker
              onUpdate={(range) => {
                setCustomRange(range);
                setDateFilter("custom");
              }}
              dateRange={customRange}
            />
          </div>
        </div>

        {/* Right side: Excel + Hamburger */}
        <div className="flex items-center justify-between gap-2">
          <Button
            className="bg-yellow-600 text-white"
            onClick={handleExcelDownload}
          >
            Generate Excel
          </Button>

          {/* Hamburger menu for small screens */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="space-y-3 mt-5 p-4">
                  {[
                    { label: "Today", value: "today" },
                    { label: "Yesterday", value: "yesterday" },
                    { label: "Last 7 Days", value: "last7" },
                    { label: "Last 30 Days", value: "last30" },
                  ].map((item) => (
                    <Button
                      key={item.value}
                      className="w-full"
                      variant={
                        dateFilter === item.value ? "default" : "outline"
                      }
                      onClick={() => {
                        setDateFilter(item.value);
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto w-[360px] sm:w-full rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Space Name</TableHead>
              <TableHead>Table Name</TableHead>
              <TableHead>Guest Count</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBills && filteredBills.length > 0 ? (
              filteredBills.map((bill, index) => (
                <TableRow key={bill._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {(() => {
                      const date = new Date(bill.createdAt);
                      const day = String(date.getDate()).padStart(2, "0");
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      const year = date.getFullYear();
                      return `${day}/${month}/${year}`;
                    })()}
                  </TableCell>
                  <TableCell>{bill.spaceName || "-"}</TableCell>
                  <TableCell>{bill.tableName || "-"}</TableCell>
                  <TableCell>{bill.guestCount || "-"}</TableCell>
                  <TableCell>{bill.totalAmount}</TableCell>
                  <TableCell
                    className={
                      bill.status === "PAID" ? "text-green-600" : "text-red-500"
                    }
                  >
                    {bill.status}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  No bills found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminBills;
