const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user_id:{type: String, required: true, unique: true},
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'user', 'rider'], default: 'user' },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' }
});

module.exports = mongoose.model('User', UserSchema);
