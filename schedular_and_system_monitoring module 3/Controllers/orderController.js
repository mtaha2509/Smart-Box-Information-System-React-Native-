const Order = require("../models/orderModel.js");
const mongoose = require('mongoose');

exports.updateOrderStatus = async (req, res) => {
    try {
        // Extract orderId, boxId, and location from the request body
        const { boxId, location } = req.body;
        

        // Validate that all required fields are provided
        if (!boxId || !location) {
            return res.status(400).json({ message: "Box ID, and location are required" });
        }

        const boxObjectId = new mongoose.Types.ObjectId(boxId);

        // Find the order by orderId and boxId, and update its status and location
        const updatedOrder = await Order.findOneAndUpdate(
            { box_id: boxObjectId }, // Filter by orderId and boxId
            { 
                status: "finalized",  // Set status to "finalized"
                location: location    // Set the location as provided
            }, 
            { new: true } // Return the updated order in the response
        );

        // If no order is found with the given orderId and boxId
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found with the given Order ID and Box ID" });
        }

        // Return the updated order
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update order", error });
    }
};

exports.setBoxReceived = async (req, res) => {
    try {
        // Extract boxId from the request body
        const { boxId } = req.body;

        // Validate that boxId is provided
        if (!boxId) {
            return res.status(400).json({ message: "Box ID is required" });
        }

        const boxObjectId = new mongoose.Types.ObjectId(boxId);

        // Find the order by boxId and update its received status
        const updatedOrder = await Order.findOneAndUpdate(
            { box_id: boxObjectId }, // Filter by boxId
            { received: true }, // Set received to true
            { new: true } // Return the updated order in the response
        );

        // If no order is found with the given boxId
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found with the given Box ID" });
        }

        // Return the updated order
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update received status", error });
    }
};