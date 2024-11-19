// Log.js
const mongoose = require('mongoose');
const LogSchema = new mongoose.Schema({
    accountId: {
        type: String,  // Admin or User ID
        required: true
    },
    message: {
        type: String,  // The log message (e.g., "Admin logged in.")
        required: true
    },
    logType: {
        type: String,  // The type of log (e.g., 'admin' or 'user')
        enum: ['admin', 'user'],  // Limit log type to either 'admin' or 'user'
        required: true
    },
    eventType: {
        type: String,  // Event type (e.g., 'OTP', 'Access')
        enum: ['OTP', 'Access', 'Delivery', 'Login', 'Logout'],  // Possible event types
        required: true
    },
    timestamp: {
        type: Date,  // The time the log entry was created
        default: Date.now
    }
});
module.exports = mongoose.model('Log', LogSchema);
