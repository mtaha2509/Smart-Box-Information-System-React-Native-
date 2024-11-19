// utils/logger.js

const winston = require('winston');

// Configure logger with levels and transports
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(), // Log to console
        new winston.transports.File({ filename: 'logs/app.log' }) // Log to file
    ]
});

// Info-level logger
exports.info = (message) => {
    logger.info({ message });
};

// Error-level logger
exports.error = (message) => {
    logger.error({ message });
};

// Debug-level logger
exports.debug = (message) => {
    logger.debug({ message });
};

// Log events specifically for OTP-related actions
exports.logOTPEvent = (type, details) => {
    logger.info({ eventType: 'OTP', type, details });
};
