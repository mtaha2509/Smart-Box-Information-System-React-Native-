const express = require('express');
const {
  suspendAccount,
  addLog,
  viewLogs,
  generateOTPController,
  validateOTPController,
  validateAccess,
  createDeliverySchedule,
  adjustSchedule,
  manageUserAccount,
} = require('../controllers/adminController'); 

const { checkAdmin } = require('../middleware/auth'); 

const router = express.Router();

// Routes
//router.put('/suspend/:user_id', checkAdmin, suspendAccount); // Suspend account
router.put('/suspend/:accountId', (req, res, next) => {
    console.log('Suspend route is being hit');
    next();
}, checkAdmin, suspendAccount);
router.post('/logs/add', checkAdmin, addLog); // Add logs
router.get('/logs/view', checkAdmin, viewLogs); // View activity logs
router.post('/otp/generate', checkAdmin, generateOTPController); // Generate OTP
router.post('/otp/validate', checkAdmin, validateOTPController); // Validate OTP
router.post('/access', checkAdmin, validateAccess); // Role-based access validation
router.put('/schedule/:deliveryId', checkAdmin, adjustSchedule); // Adjust delivery schedule

//route for adding new entry in database
const { addUser,addAdmin,login } = require('../controllers/adminController');
router.post('/user/adduser',addUser);
router.post('/user/addadmin',addAdmin);
router.post('/login',login);
router.post('/schedule/create', checkAdmin, createDeliverySchedule);


module.exports = router;
