const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { verifyToken, requireStudent } = require('../middleware/authMiddleware');

// 1. POST /api/register (Student only)
router.post('/register', verifyToken, requireStudent, registrationController.registerToEvent);

// 2. GET /api/my-registrations (Student only)
router.get('/my-registrations', verifyToken, requireStudent, registrationController.getMyRegistrations);

module.exports = router;
