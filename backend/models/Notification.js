const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to the User model
    },
    message: {
      type: String,
      required: true, // Ensure the message field is mandatory
    },
    isRead: {
      type: Boolean,
      default: false, // Default value for new notifications
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Notification", notificationSchema);
