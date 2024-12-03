const mongoose = require("mongoose");

const riderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone_number: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(v) {
          return /^\d{10}$/.test(v); // Check if the contact is exactly 10 digits
        },// phone numbers must be 10-digit
        message: "Phone number must be a 10-digit number."
      }
    },
    password: { type: String, required: true },
    status: { type: String, enum: ["free", "in_delivery"], default: "free" }, // free/on a delivery trip
    orders_assigned: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rider", riderSchema);