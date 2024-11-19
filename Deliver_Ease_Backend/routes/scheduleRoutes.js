// scheduleRoutes.js
const express = require('express');
const router = express.Router();
const { createDeliverySchedule, adjustSchedule } = require('../controllers/scheduleController');
const { checkAdmin } = require('../middleware/auth');  // Custom middleware to verify admin

// Route for creating a delivery schedule
router.post('/schedule', checkAdmin, createDeliverySchedule);

// Route for adjusting an existing delivery schedule
router.put('/schedule/:deliveryId', checkAdmin, adjustSchedule);

module.exports = router;
