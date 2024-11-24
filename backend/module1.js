const express = require("express");
const app = express();
const db = require("./config/mongooseConnection");
app.use(express.json());

const User = require("./models/userModel");
const Order = require("./models/orderModel");
const Log = require("./models/logModel");
const Rider = require("./models/riderModel");

// Function to check if user and order IDs are valid
async function checkUserAndOrder(userId, orderId) {
  try {
    // Find the user and order by their respective IDs
    const user = await User.findById(userId);
    const order = await Order.findById(orderId);

    // Check if both user and order are found
    if (!user) {
      return { valid: false, message: "User not found" };
    }

    if (!order) {
      return { valid: false, message: "Order not found" };
    }
    if (order.state != "finalized") {
      return { valid: false, message: "Order is not finalized yet by rider" };
    }
    // If everything good, return valid
    return { user, order, valid: true };
  } catch (error) {
    console.error("Error finding user or order:", error);
    return { valid: false, message: `An error occurred: ${error.message}` };
  }
}


//This API will receive user_id , will generate a otp and store it in the logs , then the response will be sent to user with OTP
app.post("/generate-opt", async (req, res) => {
  const { client_id, order_id } = req.body;
  const validationResult = await checkUserAndOrder(client_id, order_id);
  if (validationResult.valid) {
    let { user, order } = validationResult;
    const box_id = order.box_id;
    // Generate OTP
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    // Log the OTP generation
    const logEntry = new Log({
      client_id,
      order_id,
      box_id,
      otp,
      otp_flag: true,
    });
    await logEntry.save();
    console.log(logEntry);
    res.status(200).json({ otp });
  } else {
    const logEntry = new Log({ client_id }); //user and order number not valid
    await logEntry.save();
    console.log(validationResult.message);
    res.status(400).json({ error: validationResult.message });
  }
});


// This API will receive user_id and check weather the OTP is valid or not by finding the latest LOG of the OTP entry and then by checking its validity, once valid OTP found it will be send via response.
app.post("/request-otp-for-matching", async (req, res) => {
  const { userId } = req.body;

  // Validate input
  if (!userId) {
    return res.status(400).send({ message: "Missing required field: userId" });
  }

  try {
    // Retrieve the latest OTP record for the user
    const log = await Log.findOne(
      { client_id: userId },
      { otp: 1, otp_flag: 1 }
    ).sort({ createdAt: -1 });

    if (!log || log.otp_flag === 0) {
      return res
        .status(404)
        .send({ message: "No valid OTP found for this user" });
    }
    // Return the OTP if found
    return res.status(200).send({ otp: log.otp });
  } catch (error) {
    console.error(error); // Log the actual error for debugging
    return res.status(500).send({
      message: "An error occurred while retrieving the OTP. Please try again.",
    });
  }
});



// This API will change the state of order to in_transit plus it will also add the order to the riders list of assigned orders

app.post("/transitionToTransit", async (req, res) => {
  const { order_id, rider_id } = req.body;

  if (!order_id || !rider_id) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  try {
    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    const order = await Order.findById(order_id).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send({ message: "Order not found" });
    }

    if (order.state === "initial_state") {
      const rider = await Rider.findById(rider_id).session(session);
      if (!rider) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).send({ message: "Rider not found" });
      }

      // Update the order and rider atomically
      order.state = "in_transit";
      order.rider_id = rider_id;
      await order.save({ session });

      rider.orders_assigned.push(order_id);
      await rider.save({ session });

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      return res.status(200).send({ message: "Order transitioned to transit" });
    } else if (order.state === "in_transit") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({ message: "Order already in transit" });
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({ message: "Order already finalized" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});


// This API will receive a request from the Rider's UI and req will contain rider's id plus specific order id, after that then the order state will change to finalized and the order will be removed from the queue of rider named assigned orders. 

app.post("/finalize-order", async (req, res) => {
  const { rider_id, order_id } = req.body;

  // Validate input
  if (!rider_id || !order_id) {
    return res
      .status(400)
      .json({ error: "Missing required fields: rider_id or order_id" });
  }

  try {
    // Find the rider and order
    const rider = await Rider.findById(rider_id);
    const order = await Order.findById(order_id);

    if (!rider) {
      return res.status(404).json({ error: "Rider not found" });
    }

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the order state to "finalized"
    order.state = "finalized";
    await order.save();

    // Remove the order ID from the rider's orders_assigned list
    rider.orders_assigned = rider.orders_assigned.filter(
      (assignedOrderId) => assignedOrderId.toString() !== order_id
    );
    await rider.save();

    // Send a success response
    res.status(200).json({ message: "Order finalized successfully" });
  } catch (error) {
    console.error("Error finalizing order:", error);
    res
      .status(500)
      .json({ error: "An internal server error occurred. Please try again." });
  }
});
