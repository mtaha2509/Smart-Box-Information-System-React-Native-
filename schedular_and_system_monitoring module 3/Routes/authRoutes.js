const express = require("express");
const { login,riderLogin, userLogin } = require("../Controllers/authController");

const router = express.Router();

// Admin login route
router.post("/login", login);
//Rider login route
router.post("/riderlogin", riderLogin);
router.post('/userlogin', userLogin)
module.exports = router;
