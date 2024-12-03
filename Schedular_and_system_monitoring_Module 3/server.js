const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const riderRoutes = require("./routes/riderRoutes");
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

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
