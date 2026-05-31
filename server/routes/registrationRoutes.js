const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const verifyToken = require('../middleware/authMiddleware');

// Route mapping for registrations (all are protected)
router.post('/', verifyToken, registrationController.registerToEvent);
router.get('/my', verifyToken, registrationController.getMyRegistrations);

module.exports = router;
