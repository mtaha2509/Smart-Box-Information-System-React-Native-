const Rider = require("../models/riderModel.js");
const Order = require("../models/orderModel.js");
const bcrypt = require("bcrypt");
const mongoose=require('mongoose');
// Create a new rider
exports.createRider = async (req, res) => {
  try {
    const { name, phone_number, password, status, orders_assigned } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the rider
    const newRider = await Rider.create({
      name,
      phone_number,
      password: hashedPassword,
      status,
      orders_assigned: orders_assigned || [],
    });

    res.status(201).json({ message: "Rider created successfully", rider: newRider });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create rider", error });
  }
};

// Get all riders
exports.getAllRiders = async (req, res) => {
  try {
    const riders = await Rider.find();
    res.status(200).json(riders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch riders", error });
  }
};

// Update a rider by ID
exports.updateRider = async (req, res) => {
  try {
    const {status } = req.body;

    const updatedRider = await Rider.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedRider) return res.status(404).json({ message: "Rider not found" });

    res.status(200).json({ message: "Rider updated successfully", rider: updatedRider });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update rider", error });
  }
};

// Delete a rider by ID
exports.deleteRider = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Name is required to delete a rider" });
      }
    const deletedRider = await Rider.findOneAndDelete(name);
    if (!deletedRider) return res.status(404).json({ message: "Rider not found" });

    res.status(200).json({ message: "Rider deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete rider", error });
  }
};

// Get all orders assigned to a rider
exports.getRiderOrders = async (req, res) => {
  try {
    const riderId = new mongoose.Types.ObjectId(req.body);
    const orders = await Order.find({ rider_id: riderId });
    console.log(orders);
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch rider orders", error });
  }
};

