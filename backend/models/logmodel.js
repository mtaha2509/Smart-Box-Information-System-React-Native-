    const mongoose = require("mongoose");

    const logSchema = new mongoose.Schema({
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        default: null,
        index: true,
    },
    box_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Box",
        default: null,
        index: true,
    },
    otp_flag: { type: Boolean, required: true, default: false }, // success or fail
    otp: { type: String, default: null }, // if OTP successfully generated then only change the default value
    },{timestamps:true});

    module.exports = mongoose.model("Log", logSchema);
