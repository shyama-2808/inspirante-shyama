const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// 1. GET /api/events (Accessible to all authenticated users)
router.get('/', verifyToken, eventController.getEvents);

// 2. POST /api/events (Admin only)
router.post('/', verifyToken, requireAdmin, eventController.createEvent);

// 3. GET /api/events/:id/registrations (Admin only)
router.get('/:id/registrations', verifyToken, requireAdmin, eventController.getEventRegistrations);

module.exports = router;
