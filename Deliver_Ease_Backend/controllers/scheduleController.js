// scheduleController.js
const Schedule = require('../models/schedule');

// Create a new delivery schedule
exports.createDeliverySchedule = async (req, res) => {
    const { rider_id, delivery_time, box_location } = req.body;

    try {
        const newSchedule = new Schedule({
            riderId: rider_id,
            deliveryTime: delivery_time,
            boxLocation: box_location,
        });

        await newSchedule.save();
        res.status(201).json({ message: 'Schedule created successfully', newSchedule });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Adjust an existing delivery schedule
exports.adjustSchedule = async (req, res) => {
    const { rider_id, delivery_id, new_delivery_time } = req.body;

    try {
        const updatedSchedule = await Schedule.findOneAndUpdate(
            { riderId: rider_id, _id: delivery_id },
            { $set: { deliveryTime: new_delivery_time } },
            { new: true }
        );

        if (!updatedSchedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        res.status(200).json({ message: 'Schedule updated successfully', updatedSchedule });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
