const mongoose = require('mongoose');

// Function to generate a unique order number

// Define the delivery schema
const deliverySchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    customer: {
        type: String,
        required: true
    },
    otp: {
        code: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    deliveryStatus: {
        type: String,
        enum: ['initial state', 'in transit', 'finalized'], // Allowed values for deliveryStatus
        default: 'initial state'
    },
    timestamps: {
        createdAt: {
            type: Date,
            default: Date.now
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    }
});

// Middleware to update the lastUpdated timestamp automatically
deliverySchema.pre('save', function (next) {
    this.timestamps.lastUpdated = new Date();
    next();
});

// Export the delivery model
module.exports = mongoose.model('Delivery', deliverySchema);
