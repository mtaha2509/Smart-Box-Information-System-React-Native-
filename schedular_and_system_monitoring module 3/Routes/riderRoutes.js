const express = require("express");
const { verifyRiderToken } = require("../Middlewares/authMiddleware");
const {
  getRiderOrders,
  updateOrderStatus,
} = require("../Controllers/riderController");

const router = express.Router();

// Get all orders assigned to a rider
router.get("/getorders", verifyRiderToken, getRiderOrders);

// Update order status (e.g., mark as delivered)
//router.put("/orders/:orderId/status", verifyToken, updateOrderStatus);

module.exports = router;
