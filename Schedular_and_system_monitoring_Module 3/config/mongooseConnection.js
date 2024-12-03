// const dotenv=require('dotenv').config();
// const mongoose = require("mongoose");
// require("dotenv").config();
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log(`Connected to MongoDB on PORT ${process.env.PORT}`))
//   .catch((err) => console.error("MongoDB connection error:", err));

// console.log("MongoDB URI:", process.env.MONGO_URL);
// module.exports = mongoose.connection;   

require('dotenv').config();
const mongoose = require('mongoose');
//const { mongoDb_connection_string } = require('./importEnvVar');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL); 
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1); 
    }
};

module.exports = connectDB;