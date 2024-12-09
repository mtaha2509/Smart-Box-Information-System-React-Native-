const express = require("express");
const router = express.Router();
const {
  generateDummyBoxes,
  updateBoxStatuses,
  getBoxes,
  getBox,
  generateOTPRider,
} = require("./controller"); // Import the controllers

// Route to populate dummy boxes (called automatically elsewhere in the app if needed)
router.post("/generate-dummy-boxes", generateDummyBoxes);

// Route to update box statuses
router.post("/update-box-statuses", updateBoxStatuses);

// Route to get all boxes
router.get("/boxes", getBoxes);

// Route to find a box based on location and size
router.post("/getbox", getBox);

// Route to generate an OTP for a rider
router.get("/generateotprider", generateOTPRider);

module.exports = router;
