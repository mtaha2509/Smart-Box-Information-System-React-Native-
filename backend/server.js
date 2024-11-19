const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Order = require('./models/delivery'); // Assuming your model is in models/Order.js

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/otpModule', { useNewUrlParser: true, useUnifiedTopology: true });

app.put('/update-delivery-status', async (req, res) => {
    const { orderNumber, deliveryStatus } = req.body;

    if (!orderNumber || !deliveryStatus) {
        return res.status(400).send({ message: 'Order number and delivery status are required' });
    }

    if (!['In Transit', 'Finalized'].includes(deliveryStatus)) {
        return res.status(400).send({ message: 'Invalid delivery status' });
    }

    try {
        const order = await Order.findOneAndUpdate(
            { orderNumber },
            { deliveryStatus },
            { new: true }
        );

        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }

        // Include order number in the response
        res.send({
            message: 'Delivery status updated successfully',
            orderNumber: order.orderNumber,
            deliveryStatus: order.deliveryStatus,
        });
    } catch (error) {
        res.status(500).send({ message: 'Error updating delivery status', error });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});