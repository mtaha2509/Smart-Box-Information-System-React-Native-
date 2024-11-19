// Generate OTP
const generateOTP = async (delivery_id, user_id) => {
    try {
        // Check if the delivery exists
        console.log('Looking for delivery with ID:', delivery_id);
        const delivery = await DeliverySchedule.findOne({ delivery_id });
        if (!delivery) {
            return { error: "Invalid Delivery ID" };
        }

        // Now, check if the user (or admin) exists
        const user = await Admin.findOne({ accountId: user_id });
        if (!user) {
            return { error: "Invalid User ID" };
        }

        // Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Save OTP in the database with delivery and user details
        const logEntry = {
            type: 'OTP',
            message: `OTP generated for delivery ID: ${delivery_id}`,
            timestamp: new Date(),
        };

        // Update the user with OTP and expiry time
        await Admin.findOneAndUpdate(
            { accountId: user_id },
            { $set: { otp, otpExpiry: Date.now() + 10 * 60 * 1000 }, $push: { logs: logEntry } },
            { new: true }
        );

        // Return the OTP and expiry if successful
        return { otp, expiry: Date.now() + 10 * 60 * 1000 };
    } catch (error) {
        console.error('Error in OTP generation:', error);
        return { error: 'Server error while generating OTP' };
    }
};
module.exports=generateOTP;
// Validate OTP
exports.validateOTP = async (req, res) => {
    const { delivery_id, user_id, otp } = req.body;

    try {
        // Find the user and validate the OTP
        const account = await Admin.findOne({ accountId: user_id });

        if (!account || account.otp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        // Check OTP expiry
        if (Date.now() > account.otpExpiry) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Mark OTP as used
        account.otp = null;
        account.otpExpiry = null;

        const logEntry = {
            type: 'OTP',
            message: `OTP validated for delivery ID: ${delivery_id}`,
            timestamp: new Date(),
        };

        account.logs.push(logEntry);
        await account.save();

        res.status(200).json({ message: 'OTP validated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

const { logOTPEvent } = require('../utils/logger');
const { validateGenerateOTPInput, validateOTPInput } = require('../utils/validator');

// exports.generateOTP = async (deliveryId, userId) => {
//     validateGenerateOTPInput(deliveryId, userId);

//     // Proceed with OTP generation logic...
// };

//exports.validateOTP = async (otp, deliveryId, userId) => {
//   validateOTPInput(otp, deliveryId, userId);

    // Proceed with OTP validation logic...
//};
