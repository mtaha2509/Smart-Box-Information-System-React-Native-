const Log = require('../models/log'); // Log model for activity logs
const Admin = require('../models/admin'); // Admin model
const User = require('../models/users');
const DeliverySchedule = require('../models/schedule'); // Delivery schedule model


//temporary test route
const addUser = async (req, res) => {
    const { user_id, name, email, role, status } = req.body; // Extract user data from the request body

    try {
        // Check if all required fields are provided
        if (!user_id ||!name || !email || !role) {
            return res.status(400).json({ message: ' Id, Name, email, and role are required' });
        }

        // Create a new user using the data provided in the request body
        const newUser = new User({
            user_id,
            name,
            email,
            role,
            status: status || 'active', // Default to 'active' if no status is provided
        });

        // Save the user to the database
        await newUser.save();

        // Respond with the newly created user details
        res.status(201).json({
            message: 'User created successfully',
            user: newUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// //add new admin
const addAdmin = async (req, res) => {
    const {admin_id,email,role, status, logs } = req.body; // Extract admin data from the request body

    try {
        // Check if all required fields are provided
        if (!email || !role) {
            return res.status(400).json({ message: 'AccountId and role are required' });
        }

        // Validate role to be either 'admin', 'customer', or 'rider'
        if (!['admin', 'customer', 'rider'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Role must be either "admin", "customer", or "rider".' });
        }

        // Create a new admin using the data provided in the request body
        const newAdmin = new Admin({
            admin_id,
            email,
            role,
            status: status || 'active', // Default to 'active' if no status is provided
            logs: logs || [], // Default to an empty array if no logs are provided
        });

        // Save the admin to the database
        await newAdmin.save();

        // Respond with the newly created admin details
        res.status(201).json({
            message: 'Admin created successfully',
            admin: newAdmin,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const login = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if email is provided
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find the admin by email
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Check if the user has the 'admin' role
        if (admin.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token expires in 1 hour
        });

        // Log the token generation (for debugging purposes)
        console.log('Generated token:', token);

        // Return the JWT token
        return res.status(200).json({
            message: 'Login successful',
            token, // Send the token to the client
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Suspend/Delete User Accoun

const suspendAccount = async (req, res) => {
    try {
        const { accountId } = req.params; // Get user ID from request parameters
        const action = req.query.action;
        if (!action || !['suspend', 'delete'].includes(action)) {
            return res.status(400).json({ message: 'Invalid or missing action. Use ?action=suspend or ?action=delete.' });
        }

        if (action === 'suspend') {
            // Suspend the user account
            const user = await User.findOneAndUpdate(
                { user_id: accountId }, // Match user by ID
                { status: 'suspended' }, // Set status to "suspended"
                { new: true } // Return the updated user document
            );

            if (!user) {
                return res.status(404).json({ message: 'User account not found' });
            }

            return res.status(200).json({ message: 'User account suspended successfully', user });
        }

        if (action === 'delete') {
            // Delete the user account
            const user = await User.findOneAndDelete({ user_id: accountId }); // Match and delete the user

            if (!user) {
                return res.status(404).json({ message: 'User account not found' });
            }

            return res.status(200).json({ message: 'User account deleted successfully', user });
        }
    } catch (error) {
        console.error('Error managing user account:', error.message);
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Add Logs
const addLog = async (req, res) => {
    try {
        const { accountId, message } = req.body;

        const account = await Admin.findOne({ accountId });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        account.logs.push({ message });
        await account.save();

        res.status(200).json({ message: 'Log added successfully', logs: account.logs });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};


// View Activity Logs
const viewLogs = async (req, res) => {
    const { filter_type, start_date, end_date } = req.query; // Extract filters from query parameters

    try {
        // Build filter conditions
        const filterConditions = {};

        if (filter_type) {
            filterConditions.type = filter_type; // Log type (e.g., OTP, access, delivery)
        }

        if (start_date && end_date) {
            filterConditions.timestamp = {
                $gte: new Date(start_date),
                $lte: new Date(end_date),
            };
        }

        // Fetch logs from the database
        const logs = await Admin.find(filterConditions).select('logs'); // Fetch only logs field

        if (!logs.length) {
            return res.status(404).json({ message: 'No logs found matching criteria' });
        }

        res.status(200).json({ logs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};


const crypto = require('crypto'); // For secure OTP generation
//const Admin = require('../models/admin');



// Validate Role-Based Access Control (RBAC)
const validateAccess = async (req, res) => {
    const { role, action } = req.body;
    
    try {
        // Check if the user has the required role for the action
        const user = req.user;  // Assuming user info is extracted from JWT token

        // Define allowed actions for each role
        const permissions = {
            admin: ['create', 'edit', 'delete', 'view'],
            manager: ['create', 'edit', 'view'],
            user: ['view'],
        };

        // Check if role exists and has permission for the requested action
        if (!permissions[user.role] || !permissions[user.role].includes(action)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }

        // Log the access validation
        const logEntry = {
            type: 'Access Control',
            message: `Access granted to ${user.role} for ${action} action.`,
            timestamp: new Date(),
        };

        // Save log entry to the database (for auditing)
        // Assume we have a Log model to save access logs
        const newLog = new Log(logEntry);
        await newLog.save();

        res.status(200).json({ message: 'Access granted.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// Create Delivery Schedule
const createDeliverySchedule = async (req, res) => {
    const {delivery_id, rider_id, delivery_time, box_location } = req.body;

    try {
        // Validate if rider is available (integrating with Module 1's rider availability API)
        const isRiderAvailable = true; // Dummy value, replace with your test scenario
        const rider = await schedule.findOne({ rider_id });
        // if (!rider || !isRiderAvailable) {
        //     return res.status(400).json({ message: 'Rider not available' });
        // }
        if ( !isRiderAvailable) {
                return res.status(400).json({ message: 'Rider not available' });
        }

        // Create the delivery schedule
        const newSchedule = new DeliverySchedule({
            delivery_id,
            rider_id,
            delivery_time,
            box_location,
            status: 'Scheduled',
        });

        await newSchedule.save();

        // Log the creation of the schedule
        const logEntry = {
            type: 'Schedule',
            message: `Delivery schedule created for delivery ID: ${delivery_id}`,
            timestamp: new Date(),
        };

        await new Log(logEntry).save();

        res.status(201).json({ message: 'Delivery schedule created', schedule: newSchedule });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Adjust Delivery Schedule
const adjustSchedule = async (req, res) => {
    const { deliveryId } = req.params;
    const { rider_id, new_delivery_time } = req.body;

    try {
        // Find and update the delivery schedule
        const schedule = await DeliverySchedule.findById(deliveryId);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        // Validate if rider is available
        const rider = await Rider.findOne({ rider_id });
        if (!rider || !rider.isAvailable) {
            return res.status(400).json({ message: 'Rider not available' });
        }

        schedule.rider_id = rider_id;
        schedule.delivery_time = new_delivery_time;

        await schedule.save();

        // Log the schedule adjustment
        const logEntry = {
            type: 'Schedule Update',
            message: `Delivery schedule updated for delivery ID: ${schedule._id}`,
            timestamp: new Date(),
        };

        await new Log(logEntry).save();

        res.status(200).json({ message: 'Schedule updated', schedule });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// adminController.js
// Suspend or delete user accounts
const manageUserAccount = async (req, res) => {
    const { action, user_id } = req.body;

    try {
        const user = await User.findById(user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (action === 'suspend') {
            user.status = 'suspended';
        } else if (action === 'delete') {
            await user.remove();
            return res.status(200).json({ message: 'User deleted successfully' });
        }

        await user.save();
        res.status(200).json({ message: `User ${action}ed successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Log events
const logEvent = async (req, res) => {
    const { event_type, details } = req.body;

    try {
        const log = new Log({
            type: event_type,
            details: details,
            timestamp: new Date(),
        });

        await log.save();
        res.status(201).json({ message: 'Event logged successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports.checkAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];  // Extract token from authorization header
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        req.user = decoded;
        next();
    });
};


const { generateOTP, validateOTP } = require('../services/otpService');
const { info, error } = require('../utils/logger');
const schedule = require('../models/schedule');

// Generate OTP Controller
const generateOTPController = async (req, res) => {
    const { delivery_id, userId } = req.body;
    console.log('Request received:', req.body);  // Log the incoming request body
    try {
        console.log('Calling generateOTP function...');
        const { otp, expiry, error } = await generateOTP(delivery_id, userId);

        if (error) {
            return res.status(400).json({ message: error });
        }

        // Log success
        info(`OTP generated successfully for Delivery ID: ${delivery_id}`);

        // Send the OTP and expiry in response
        res.status(201).json({ message: 'OTP generated successfully', otp, expiry });
    } catch (err) {
        error(`Error generating OTP for Delivery ID: ${delivery_id} - ${err.message}`);
        res.status(500).json({ message: 'Failed to generate OTP', error: err.message });
    }
};

// Validate OTP Controller
const validateOTPController = async (req, res) => {
    const { otp, deliveryId, userId } = req.body;

    try {
        const isValid = await validateOTP(otp, deliveryId, userId);
        info(`OTP validated successfully for Delivery ID: ${deliveryId}`);
        res.status(200).json({ message: 'OTP validated successfully', isValid });
    } catch (err) {
        error(`Error validating OTP for Delivery ID: ${deliveryId} - ${err.message}`);
        res.status(400).json({ message: 'Invalid OTP', error: err.message });
    }
};
module.exports = {
    suspendAccount,
    addLog,
    viewLogs, // Ensure this is exported
    generateOTPController,
    validateOTPController,
    validateAccess,
    createDeliverySchedule,
    adjustSchedule,
    manageUserAccount,addAdmin,addUser,login
};
