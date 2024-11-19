// utils/validator.js

// Validate MongoDB ObjectId format
exports.isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

// Validate input for OTP generation
exports.validateGenerateOTPInput = (deliveryId, userId) => {
    if (!this.isValidObjectId(deliveryId)) {
        throw new Error('Invalid Delivery ID');
    }
    if (!this.isValidObjectId(userId)) {
        throw new Error('Invalid User ID');
    }
};

// Validate OTP input
exports.validateOTPInput = (otp, deliveryId, userId) => {
    if (!otp || typeof otp !== 'string' || otp.length !== 6) {
        throw new Error('Invalid OTP');
    }
    this.validateGenerateOTPInput(deliveryId, userId);
};
