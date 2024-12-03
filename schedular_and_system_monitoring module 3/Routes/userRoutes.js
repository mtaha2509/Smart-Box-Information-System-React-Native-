const express = require("express");
const { verifyRiderToken } = require("../Middlewares/authMiddleware");
const {
  getUserOrders, generateOTPForUser 
} = require("../Controllers/userController");

const {
  updateOrderStatus,  setBoxReceived
} = require("../Controllers/orderController");




const router = express.Router();

router.post("/getuserorders", getUserOrders);
router.post("/updateorderstatus", updateOrderStatus)
router.get("/generateotp", generateOTPForUser)
router.post("/setboxreceived", setBoxReceived)


module.exports = router;
