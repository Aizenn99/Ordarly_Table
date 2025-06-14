const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path"); // ← Add this line

const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 8000;

const authRoutes = require("./routes/auth/auth-routes");
const adminRoutes = require("./routes/admin/admin-routes");
const staffRoutes = require("./routes/Staff/Staff-routes"); // Ensure this path is correct

mongoose
  .connect(
    process.env.MONGO_URL ||
      "mongodb+srv://kalriyahet:WQY0wzYGrs8za9al@cluster0.kf7rqts.mongodb.net/"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection failed", err));

app.use(cookieParser());


app.use(
  cors({
    origin: ["http://localhost:5173"], // ✅ Array format for multiple origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staff",staffRoutes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
