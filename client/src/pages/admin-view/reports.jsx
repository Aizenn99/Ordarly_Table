import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { fetchDashboardMetrics } from "@/store/dashboard-slice/report-slice";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { startOfDay, endOfDay, subDays, format } from "date-fns";

const socket = io("http://localhost:8000", {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
});

const COLORS = ["#22c55e", "#3b82f6", "#f97316"];

const AdminReports = () => {
  const dispatch = useDispatch();
  const { metrics, isLoading, error } = useSelector((state) => state.dashboard);

  const [dateFilter, setDateFilter] = useState("today");
  const [customRange, setCustomRange] = useState({
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
  });

  const rangeRef = useRef(customRange);

  useEffect(() => {
    rangeRef.current = customRange;
  }, [customRange]);

  const loadMetrics = () => {
    const range = rangeRef.current;
    dispatch(
      fetchDashboardMetrics({
        startDate: range.from.toISOString(),
        endDate: range.to.toISOString(),
      })
    );
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [customRange]);

  useEffect(() => {
    const handleUpdate = () => {
      console.log("📡 dashboard:update received");
      loadMetrics();
    };

    socket.on("dashboard:update", handleUpdate);
    return () => socket.off("dashboard:update", handleUpdate);
  }, []);

  const handleDateChange = (filter) => {
    setDateFilter(filter);
    let from, to = new Date();

    switch (filter) {
      case "today":
        from = startOfDay(new Date());
        to = endOfDay(new Date());
        break;
      case "yesterday":
        from = startOfDay(subDays(new Date(), 1));
        to = endOfDay(subDays(new Date(), 1));
        break;
      case "last7":
        from = startOfDay(subDays(new Date(), 6));
        to = endOfDay(new Date());
        break;
      case "last30":
        from = startOfDay(subDays(new Date(), 29));
        to = endOfDay(new Date());
        break;
      default:
        from = customRange.from;
        to = customRange.to;
    }

    setCustomRange({ from, to });
  };

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  const barData = [
    { name: "Revenue", value: metrics?.totalRevenue || 0 },
    { name: "Sales", value: metrics?.totalSales || 0 },
    { name: "Profit", value: metrics?.totalProfit || 0 },
  ];

  const pieData = [
    { name: "Cash", value: metrics?.paymentBreakdown?.cash || 0 },
    { name: "UPI/Card", value: metrics?.paymentBreakdown?.upiCard || 0 },
    { name: "Credit", value: metrics?.paymentBreakdown?.credit || 0 },
  ];

  // Simulated revenue trend data (Replace with actual if available)
  const revenueTrend = (metrics?.revenueTrend || []).map((item) => ({
  date: format(new Date(item.date), "dd MMM"), // Format to "27 Jun" etc.
  revenue: item.revenue,
}));


  return (
    <div className="p-5 bg-[#f3f6f9] min-h-screen">
      {/* Date Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="hidden sm:flex flex-wrap gap-2">
            {["today", "yesterday", "last7", "last30"].map((value) => (
              <Button
                key={value}
                variant={dateFilter === value ? "default" : "outline"}
                onClick={() => handleDateChange(value)}
              >
                {value === "last7"
                  ? "Last 7 Days"
                  : value === "last30"
                  ? "Last 30 Days"
                  : value.charAt(0).toUpperCase() + value.slice(1)}
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
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 mt-4">
        {[
          { label: "Total Revenue", value: metrics?.totalRevenue, color: "text-green-600" },
          { label: "Total Orders", value: metrics?.totalOrders, color: "text-black" },
          { label: "Cash", value: metrics?.paymentBreakdown?.cash, color: "text-primary" },
          { label: "UPI / Card", value: metrics?.paymentBreakdown?.upiCard, color: "text-blue-600" },
          { label: "Credit", value: metrics?.paymentBreakdown?.credit, color: "text-orange-600" },
          { label: "Profits", value: metrics?.totalProfit, color: "text-purple-600" },
          { label: "Total Sales", value: metrics?.totalSales, color: "text-green-700" },
        ].map(({ label, value, color }, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">{label}</p>
              <h3 className={`text-lg font-semibold ${color}`}>₹{value || 0}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-md font-semibold mb-4">Overview (Bar Chart)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-md font-semibold mb-4">Payment Method Split (Pie Chart)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Area Chart for Revenue */}
     <div className="mt-8">
  <Card>
    <CardContent className="p-4">
      <h2 className="text-md font-semibold mb-4">Revenue Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={revenueTrend}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="purpleRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#8b5cf6"
            fillOpacity={1}
            fill="url(#purpleRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
</div>

    </div>
  );
};

export default AdminReports;
