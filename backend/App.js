const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios"); // For communication with other modules
const Log = require("./models/logmodel"); // Import the log schema
const app = express();
const cors = require("cors");
app.use(cors({
  origin: "http://localhost:5173", // Allow only your frontend origin
  methods: ["GET", "POST"], // Specify allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
}));

app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/otpModule", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));



// app.post("/generate-otp", async (req, res) => {
//   const { customerId } = req.body;

//   if (customerId==="") {
//     const logEntry = new Log({
//       customer_id: customerId,
//       order_no: null,
//       box_id: null,
//       otp_flag: "failed",
//       otp: null,
//     });
//     await logEntry.save();
//     return res.status(400).json({ message: "Customer ID is required" });
//   }

//   try {
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     // Alert Module 3 (Delivery Scheduler)
//     const responseModule3 = await axios.post("http://localhost:3001/module3", {
//       customerId
//     }); 
//       console.log(responseModule3);
//       const { box_id, order_no } = responseModule3.data;
//       const logEntry = new Log({
//         customer_id: customerId,
//         order_no,
//         box_id,
//         otp_flag: "true",
//         otp,
//       });
//       await logEntry.save();
//       console.log(logEntry);
//       return res.status(200).json({
//         message: "OTP generated successfully",
//         otp: otp,
//       });
    
//   } catch (error) {
//     console.error("Error:", error.message);
//     return res.status(500).json({
//       message: "Failed to generate OTP",
//       error: error.message,
//     });
//   }
// });


// Start the server

app.post("/generate-otp", async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    const logEntry = new Log({
      customer_id: customerId || null,
      order_no: null,
      box_id: null,
      otp_flag: "failed",
      otp: null,
    });
    try {
      await logEntry.save();
    } catch (error) {
      console.error("Error saving log entry:", error.message);
    }
    return res.status(400).json({ message: "Customer ID is required" });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Alert Module 3 (Delivery Scheduler)
    const responseModule3 = await axios.post(
      "http://localhost:3001/module3",
      { customerId },
      { timeout: 5000 } // 5-second timeout
    );
    console.log(responseModule3);
    if (!responseModule3.data || !responseModule3.data.box_id || !responseModule3.data.order_no) {
      throw new Error("Invalid response from module3");
    }

    const { box_id, order_no } = responseModule3.data;

    const logEntry = new Log({
      customer_id: customerId,
      order_no,
      box_id,
      otp_flag: "true",
      otp,
    });

    try {
      await logEntry.save();
    } catch (error) {
      console.error("Error saving log entry:", error.message);
    }

    console.log(logEntry);
    return res.status(200).json({
      message: "OTP generated successfully",
      otp: otp,
    });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Failed to generate OTP",
      error: error.message,
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
