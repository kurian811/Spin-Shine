// In notificationRoutes.js
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Create a new notification
router.post("/create", notificationController.createNotification);

// Get notifications for a specific user
router.get('/user/:userId', notificationController.getNotifications);

router.put('/markAsRead/:userId', notificationController.markAsRead);


// Route to delete read notifications
router.delete('/deleteRead/:userId', notificationController.deleteReadNotifications);

module.exports = router;
