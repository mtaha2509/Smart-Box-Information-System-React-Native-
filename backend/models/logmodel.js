const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    customer_id: { type: String, required: true },
    order_no: { type: String },
    box_id: { type: String },
    otp_flag: { type: String, required: true }, // success or failed
    otp: { type: String }, // OTP is null if the generation fails
    //message:{ type: String},
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Log', logSchema);