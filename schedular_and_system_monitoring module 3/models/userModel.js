const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {type: String, required: true},
    contact: {
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
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    type: { type: String, enum: ["normal", "admin"], default: "normal" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);