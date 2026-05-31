const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const verifyToken = require('../middleware/authMiddleware');

// Route mapping for events
router.get('/', eventController.getEvents); // Public route
router.post('/', verifyToken, eventController.createEvent); // Protected admin route

module.exports = router;
