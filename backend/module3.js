const express = require("express");
const app = express();
app.use(express.json());

app.post("/module3", async (req, res) => {
  let { customerId } = req.body;
  try {
    // randomly generate box id and order no
    // in reality the customer id will be checked from the DB and boxId and orderNo against it will be taken from there and will be sent
    // forward
    const box_id = Math.floor(Math.random() * 1000000000);
    const order_no = Math.floor(Math.random() * 1000000000);
    res.status(200).json({ box_id, order_no });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Failed to generate box and order number",
        error: error.message,
      });
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
