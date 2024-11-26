const Rider = require('../models/riderModel'); 
const Admin = require('../models/adminModel.js');  
const bcrypt = require('bcrypt');  
const jwt = require('jsonwebtoken');  

// Admin Login 
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const admin = await Admin.findOne({ email });
    console.log(admin)
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' }); // Admin does not exist
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' }); // Invalid password
    }

    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      message: 'Login successful',
      admin: { username: admin.name, email: admin.email},
      token,
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

//rider Login
exports.riderLogin = async (req, res) => {
    const { phone_number, password } = req.body;
  
    if (!phone_number || !password) {
      return res.status(400).json({ message: 'Phone number and password are required.' });
    }
  
    try {
      const rider = await Rider.findOne({ phone_number });
      console.log(rider);
      if (!rider) {
        return res.status(404).json({ message: 'Rider not found' }); // Rider does not exist
      }
  
      const isPasswordValid = await bcrypt.compare(password, rider.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' }); // Invalid password
      }
  
      const token = jwt.sign({ id: rider._id, phone_number: rider.phone_number }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      return res.status(200).json({
        message: 'Login successful',
        rider: { name: rider.name, phone_number: rider.phone_number, status: rider.status },
        token,
      });
  
    } catch (error) {
      console.error('Error during rider login:', error);
      res.status(500).json({ message: 'Server error during rider login' });
    }
  };