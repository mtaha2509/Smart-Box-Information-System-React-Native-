const mongoose = require("mongoose");

const BoxSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  location: String,
  size: String,
  locked: Boolean,
  occupied: Boolean,
});

const Box = mongoose.model("Box", BoxSchema);

module.exports = Box;





