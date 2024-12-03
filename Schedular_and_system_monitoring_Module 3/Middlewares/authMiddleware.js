const jwt = require("jsonwebtoken");
const Admin = require('../models/adminModel'); 
const Rider = require("../models/riderModel.js");

exports.verifyAdminToken = async(req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Token required or improperly formatted" });
    }
    const token = authHeader.split(" ")[1];
    //console.log("token",token);
    if (!token) {
      return res.status(403).json({ message: "Token is missing or improperly formatted" });
    }

  try {
    //const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const decoded = jwt.decode(token, { complete: true });
    //console.log("Decoded Token Payload:", decoded);
    req.user = decoded;
    payload = decoded.payload;
    //console.log("Email: ", payload.email);
    if (payload.email) {
        const admin = await Admin.findOne({ email: payload.email });
        //console.log("Admin:", admin);
        if (!admin) {
          return res.status(403).json({ message: "'Access Denied: Admin not found in database." });
        }
        if (payload.email !== admin.email) {
            return res.status(403).json({ message: "Access Denied: Admin only." });
        }
        return next();
      } 
      return res.status(403).json({ message: "Access Denied: Admin only." });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
exports.verifyRiderToken = async(req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Token required or improperly formatted" });
    }
    const token = authHeader.split(" ")[1];
    //console.log("token",token);
    if (!token) {
      return res.status(403).json({ message: "Token is missing or improperly formatted" });
    }

  try {
    const decoded = jwt.decode(token, { complete: true });
    //console.log("Decoded Token Payload:", decoded);
    req.user = decoded;
    payload = decoded.payload;
    //console.log("Email: ", payload.email);
      if (payload.phone_number) {
        const rider = await Rider.findOne({ phone_number: payload.phone_number });
        if (!rider) {
          return res.status(403).json({ message: "Access Denied: Rider not found in database." });
        }
        if (payload.phone_number !== rider.phone_number) {
            return res.status(403).json({ message: "Access Denied: Rider only." });
        }
        return next(); 
      }
      return res.status(403).json({ message: "Access Denied: Rider only." });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};