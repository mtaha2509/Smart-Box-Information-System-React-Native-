// accessControlService.js
const RolePermissions = require('../models/RolePermissions');

// Validate if the user has access based on their role and requested action
exports.validateAccess = async (role, action) => {
    try {
        const hasAccess = await RolePermissions.findOne({ role, action });
        return hasAccess ? true : false;
    } catch (error) {
        console.error(error);
        return false;
    }
};
