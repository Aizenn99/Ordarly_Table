const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL || "")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection failed", err));

app.use(cors({
  origin: "http://localhost:3000 || * ",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
dotenv.config();


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
