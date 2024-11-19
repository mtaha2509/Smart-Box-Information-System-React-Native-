
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin'); // Assuming Admin model holds admin details

//Middleware for Role-Based Access Control (RBAC)
exports.checkAdmin = (req, res, next) => {
    console.log('checkAdmin middleware executed');
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // console.log('Authorization Header:', req.headers.authorization);
        // console.log('Decoded Token:', decoded); // Log token content

        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied: Admins Only' });
        }

        req.user = decoded; // Attach user details to the request
        next();
    } catch (error) {
        console.error('Token Error:', error.message); // Log token errors
        return res.status(401).json({ message: 'Invalid token' });
    }
};
