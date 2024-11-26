const express = require("express");
const { verifyAdminToken } = require("../Middlewares/authMiddleware");
const {
  assignBox,
  generateOTP,
  createAdmin
} = require("../Controllers/adminController");
const {
  createRider,
  getAllRiders,
  updateRider,
  deleteRider,
} = require("../Controllers/riderController");

const router = express.Router();

// Admin routes for managing orders and scheduling
router.post("/assign-box", verifyAdminToken, assignBox);
router.post("/generate-otp", verifyAdminToken, generateOTP);

// Admin CRUD for riders
router.post("/riders/create", verifyAdminToken, createRider); // Create a new rider
router.get("/riders/getAll", verifyAdminToken, getAllRiders); // Get all riders
//router.put("/riders/update/:id", verifyToken, updateRider); // Update rider by ID
router.delete("/riders/delete", verifyAdminToken, deleteRider); // Delete rider by ID

router.post('/user/addadmin',createAdmin);
module.exports = router;
