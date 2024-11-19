// Schema for admin-related tasks

const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    admin_id:{type: String, required: true, unique: true},
    email:{type: String, required: true, unique: true},
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    role: { type: String, enum: ['admin', 'customer', 'rider'], required: true },
});

module.exports = mongoose.model('Admin', adminSchema);
