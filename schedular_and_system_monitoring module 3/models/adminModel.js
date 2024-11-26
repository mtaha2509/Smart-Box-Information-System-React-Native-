const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

// Hash the password before saving
adminSchema.pre('save', async function (next) {
    console.log("Password before hashing:", this.password);  
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Password after hashing:", this.password); 
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Admin', adminSchema);
