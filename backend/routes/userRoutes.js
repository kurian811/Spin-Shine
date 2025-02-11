const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');  // Import userController
const authenticateToken = require('../middleware/authMiddleware');  // Combined auth middleware

// Route to register a new user
router.post('/register', userController.registerUser);

// Route for user login
router.post('/login', userController.loginUser);

router.post("/forgot-password", userController.forgotPassword);


router.post("/reset-password/:token", userController.resetPassword);

// Route to fetch user profile (protected)
router.get('/profile', authenticateToken, userController.getUserProfile);

// Route to change password (protected)
router.post('/change-password', authenticateToken, userController.changePassword);

// Route to update user profile details (protected)
router.put('/update', authenticateToken, userController.updateUserProfile);  // Profile update route


module.exports = router;
