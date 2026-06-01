const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, requireAdmin, requireStudent } = require('../middleware/authMiddleware');

// Public route for authentication
router.post('/login', authController.login);

// Protected routes requiring authentication and authorization
router.get('/me', verifyToken, authController.getMe);
router.get('/admin-test', verifyToken, requireAdmin, authController.adminTest);
router.get('/student-test', verifyToken, requireStudent, authController.studentTest);

module.exports = router;
