const mongoose = require("mongoose");

const box_areaSchema = new mongoose.Schema(
  {
    capacity: { type: Number, required: true }, // total capacity(number of boxes) of box area 
    location: { type: String, required: true }, 
    boxes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Box" }], // all the box ids present in the box_area
  },
  { timestamps: true }
);

// Check if boxes array is valid and does not exceed the capacity
box_areaSchema.pre('save', function(next) {
    if (this.boxes.length > this.capacity) {
      return next(new Error(`The number of boxes (${this.boxes.length}) exceeds the capacity of the area (${this.capacity}).`));
    }
    next();
  });

module.exports = mongoose.model("BoxArea", box_areaSchema);
