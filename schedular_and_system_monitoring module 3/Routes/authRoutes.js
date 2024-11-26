const express = require("express");
const { login,riderLogin } = require("../Controllers/authController");

const router = express.Router();

// Admin login route
router.post("/login", login);
//Rider login route
router.post("/riderlogin", riderLogin);
module.exports = router;
