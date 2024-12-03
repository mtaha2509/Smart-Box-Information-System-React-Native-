const Order = require("../models/orderModel.js");
const bcrypt = require("bcrypt");
const mongoose=require('mongoose');

exports.getUserOrders = async (req, res) => {
    try {
      let { userId } = req.body;
      userId = new mongoose.Types.ObjectId(userId)
      const orders = await Order.find({ client_id: userId });
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch rider orders", error });
    }
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000); // generates a random 6-digit number
  };
  
  exports.generateOTPForUser = async (req, res) => {
    try {
      const otp = generateOTP();
      res.status(200).json({ otp });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to generate OTP", error });
    }
  };
  