const Box = require("./BoxModel");

// Generate dummy boxes
const generateDummyBoxes = async (req, res) => {
  try {
    const dummyBoxes = [
      { location: "askari X", size: "small", locked: true, occupied: false },
      { location: "gulberg", size: "medium", locked: true, occupied: false },
      { location: "askari X", size: "large", locked: true, occupied: false },
      { location: "faisal town", size: "small", locked: true, occupied: false },
      { location: "faisal town", size: "medium", locked: true, occupied: false },
      { location: "askari X", size: "large", locked: true, occupied: false },
      { location: "gulberg", size: "small", locked: true, occupied: false },
    ];

    await Box.insertMany(dummyBoxes);
    console.log("Dummy boxes inserted successfully!");
    res.status(200).json({ message: "Dummy boxes inserted successfully!" });
  } catch (error) {
    console.error("Error inserting dummy boxes:", error.message);
    res.status(500).json({ error: "Failed to insert dummy boxes." });
  }
};

// Update box statuses
const updateBoxStatuses = async (req, res) => {
  try {
    const { statuses } = req.body;

    const bulkOps = statuses.map((status) => ({
      updateOne: {
        filter: { id: status.id },
        update: { $set: status },
        upsert: true,
      },
    }));

    await Box.bulkWrite(bulkOps);
    res.status(200).json({ message: "Box statuses updated successfully." });
  } catch (error) {
    console.error("Update Status Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get all boxes
const getBoxes = async (req, res) => {
  try {
    const boxes = await Box.find();
    res.status(200).json(boxes);
  } catch (error) {
    console.error("Fetch Boxes Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get a specific box based on location and size
const getBox = async (req, res) => {
  try {
    const { location, size } = req.body;

    if (!location || !size) {
      return res.status(400).json({ error: "Location and size are required." });
    }

    const box = await Box.findOne({ location, size, occupied: false });

    if (box) {
      res.status(200).json(box);
    } else {
      res.status(404).json({ error: "No matching unoccupied box found." });
    }
  } catch (error) {
    console.error("Error fetching box:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Generate a 6-digit OTP
const generateOTPRider = (req, res) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    res.status(200).json({ otp });
  } catch (error) {
    console.error("Error generating OTP:", error.message);
    res.status(500).json({ error: "Failed to generate OTP." });
  }
};

module.exports = {
  generateDummyBoxes,
  updateBoxStatuses,
  getBoxes,
  getBox,
  generateOTPRider,
};
