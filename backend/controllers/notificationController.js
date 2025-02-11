const Notification = require("../models/Notification");
const mongoose = require("mongoose");

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;

    console.log("Received request to create notification", { userId, message });

    // Validate required fields
    if (!userId || !message) {
      return res.status(400).json({ message: "User ID and message are required." });
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId format:", userId);
      return res.status(400).json({ message: "Invalid userId format." });
    }

    // Create a new notification
    const newNotification = new Notification({
      userId: new mongoose.Types.ObjectId(userId), // Fixed: Instantiate ObjectId with `new`
      message: message.trim(),
      isRead: false,
      timestamp: new Date(),
    });

    await newNotification.save();

    console.log("Notification created successfully:", newNotification);

    return res.status(201).json({
      message: "Notification created successfully.",
      notification: newNotification,
    });
  } catch (err) {
    console.error("Error creating notification:", err);

    return res.status(500).json({
      message: "Failed to create notification.",
      error: err.message,
    });
  }
};

// Get notifications for a user
const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("Fetching notifications for userId:", userId);

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format." });
    }

    // Use `new` to create an ObjectId
    const notifications = await Notification.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 });

    return res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return res.status(500).json({ message: "Failed to fetch notifications.", error: err.message });
  }
};

// Mark all notifications as read for a user
const markAsRead = async (req, res) => {
  const { userId } = req.params;

  try {
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format." });
    }

    // Mark all unread notifications as read
    const result = await Notification.updateMany(
      { userId: new mongoose.Types.ObjectId(userId), isRead: false },
      { $set: { isRead: true } }
    );

    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: "No unread notifications to update." });
    }

    return res.status(200).json({ message: "All unread notifications marked as read." });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return res.status(500).json({ message: "Failed to mark notifications as read.", error: error.message });
  }
};

// Delete all read notifications for a user
const deleteReadNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format." });
    }

    // Delete all read notifications for the user
    const result = await Notification.deleteMany({
      userId: new mongoose.Types.ObjectId(userId),
      isRead: true,
    });

    if (result.deletedCount === 0) {
      return res
        .status(200)
        .json({ message: "No read notifications to delete." });
    }

    return res
      .status(200)
      .json({ message: "All read notifications deleted successfully." });
  } catch (error) {
    console.error("Error deleting read notifications:", error);
    return res.status(500).json({
      message: "Failed to delete read notifications.",
      error: error.message,
    });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  deleteReadNotifications,
};
