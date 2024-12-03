const Order = require("../models/orderModel");
const axios = require("axios");
const Admin = require('../models/adminModel'); 
const Rider=require('../models/riderModel')
const { calculateDistance } = require('../utils/distanceCalculator');

//add dummy orders
exports.addDummyOrder = async () => {
    try {
     
      const dummyClientId = "64c7dcff7b3f4e53e9b5f222"; 
      const dummyBoxId = "64c7dcff7b3f4e53e9b5f333";   
      const dummyRiderId = "67437dcbc5c0bdc0ee44bf4b";  
  
      // Create a new order object
      const newOrder = new Order({
        client_id: dummyClientId,
        box_id: dummyBoxId,
        rider_id: dummyRiderId,
        size: "large", 
        status: "initial_state", 
        location: "Warehouse 50",
      });
  
      const savedOrder = await newOrder.save();
      console.log("Order saved successfully:", savedOrder);
    } catch (error) {
      console.error("Error creating order:", error.message);
    }
  };
//add admin
exports.createAdmin = async (req, res) => {
  try {
    const newAdmin = new Admin({
      name:'admin',
      email: 'admin@example.com',
      password: 'admin123',

    });

    await newAdmin.save();
    res.status(200).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating admin", error });
  }
};
// Assign a box to an order
exports.assignBox = async (req, res) => {
    try {
      const { orderId, boxLocation } = req.body; 
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      if (order.rider_id || order.status === "in_transit") {
        return res.status(400).json({ message: "Order is already assigned to a rider or is in transit" });
      }
  
      const riders = await Rider.find({ status: "free" });
      if (riders.length === 0) {
        return res.status(404).json({ message: "No free riders available" });
      }
      
      // Calculate distance from each rider's current location to the new box location
      let nearestRider = null;
      let minDistance = Infinity;

      for (const rider of riders) {
          const distance = calculateDistance(rider.currentLocation, boxLocation);

          if (distance < minDistance) {
              minDistance = distance;
              nearestRider = rider;
          }
      }

      if (!nearestRider) {
          return res.status(400).json({ message: "No suitable rider found" });
      }

      // Request a box from Module 2
      const response = await axios.post("http://module2-url/api/getBox", { size: order.size });
      const { boxId } = response.data;

      if (!boxId) {
          return res.status(400).json({ message: "No matching box available" });
      }
  
      // Update order and rider details
      order.box_id = boxId;
      order.rider_id = nearestRider._id;
      order.status = "in_transit";
      await order.save();

      nearestRider.status = "in_delivery";
      nearestRider.destination = boxLocation;
      await nearestRider.save();
  
      res.status(200).json({
        message: "Box assigned successfully",
        order,
        rider: nearestRider,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  };
// Generate OTP for Rider and notify other modules (Module 2 and Module 4)
exports.generateOTP = async (req, res) => {
  try {
    const { riderId } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const rider = await Rider.findById(riderId);
    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }
    rider.status = "free"; 
    await rider.save();

    const module2Request = axios.post("http://module2/api/verify-otp", { riderId, otp });
    const module4Request = axios.post("http://module4/api/open-box", { riderId, otp });

    const [module2Response, module4Response] = await Promise.all([module2Request, module4Request]);

    // Handle Responses
    if (module2Response.status === 200 && module4Response.status === 200) {
      res.status(200).json({
        message: "OTP generated and sent to modules successfully",
        otp,
        module2Response: module2Response.data,
        module4Response: module4Response.data,
      });
    } else {
      res.status(400).json({
        message: "Failed to communicate with one or more modules",
        module2Response: module2Response.data,
        module4Response: module4Response.data,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};



