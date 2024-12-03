const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const adminRoutes = require("./Routes/adminRoutes");
const authRoutes = require("./Routes/authRoutes");
const riderRoutes = require("./Routes/riderRoutes");
const userRoutes = require("./Routes/userRoutes")
//const { addDummyOrder } = require('./Controllers/adminController'); // Adjust the path
const connectDB = require('./config/mongooseConnection');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
// Middleware
app.use(express.json());
  // (async () => {
  //   await addDummyOrder();
  // })();
// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/riders", riderRoutes);
app.use("/api/users", userRoutes)

// Start Server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
