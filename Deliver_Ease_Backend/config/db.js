// MongoDB connection setup

require('dotenv').config();
const mongoose = require('mongoose');
const { mongoDb_connection_string } = require('./importEnvVar');
const connectDB = async () => {
    try {
        await mongoose.connect(mongoDb_connection_string); // No additional options needed
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
