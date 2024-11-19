// Entry Point
// Import required modules
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // MongoDB connection setup
const adminRoutes = require('./routes/adminRoutes'); // Admin-related routes
const scheduleRoutes = require('./routes/scheduleRoutes'); // Schedule-related routes
const {port}=require('./config/importEnvVar');
// Connect to MongoDB
connectDB();
// Initialize the Express application
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Use the routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin', scheduleRoutes);

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));

