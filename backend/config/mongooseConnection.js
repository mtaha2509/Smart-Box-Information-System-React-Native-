const mongoose = require("mongoose");
require("dotenv").config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log(`Connected to MongoDB on PORT ${process.env.PORT}`))
  .catch((err) => console.error("MongoDB connection error:", err));

console.log("MongoDB URI:", process.env.MONGO_URL);
module.exports = mongoose.connection;
