const mongoose = require("mongoose");

const boxSchema = new mongoose.Schema(
  {
    size: { 
      type: String, 
      enum: ["small", "medium", "large"], 
      required: true,
      trim: true  
    },
    status: { 
      type: String, 
      enum: ["free", "occupied"], 
      default: "free",
      trim: true  
    },
    state: { 
      type: String, 
      enum: ["open", "close"], 
      default: "close",
      trim: true 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Box", boxSchema);
