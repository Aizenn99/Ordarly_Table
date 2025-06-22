const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

const http = require("http"); // ✅ Needed for socket.io
const socketIO = require("socket.io");
// ✅ Setup HTTP Server and Socket.IO
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Share `io` instance across routes via app.set
app.set("io", io);

io.on("connection", (socket) => {
  console.log("🟢 A client connected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 A client disconnected: ", socket.id);
  });
});

dotenv.config();
const PORT = process.env.PORT || 8000;

// Routes
const authRoutes = require("./routes/auth/auth-routes");
const adminRoutes = require("./routes/admin/admin-routes");
const staffRoutes = require("./routes/Staff/Staff-routes"); // Make sure the path is correct
const kitchenRoutes = require("./routes/Kitchen/kitchen-routes")(io);

// MongoDB Connection
mongoose
  .connect(
    process.env.MONGO_URL ||
      "mongodb+srv://kalriyahet:WQY0wzYGrs8za9al@cluster0.kf7rqts.mongodb.net/"
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB connection failed", err));

// Middlewares
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH",], // ✅ Add PATCH here
  })
);  app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/kitchen", kitchenRoutes);



// Start server
server.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
