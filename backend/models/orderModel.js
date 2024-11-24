const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    box_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Box",
    },
    rider_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rider",
    },
    size: { type: String, enum: ["small", "medium", "large"], required: true }, // Allowed values for order size
    status: {
      type: String,
      enum: ["initial_state", "in_transit", "finalized"], // Allowed values for order status
      default: "initial_state",
      index: true,
    },
    location: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
