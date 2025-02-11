const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roomNumber: { type: String, required: true },
  laundryId: { type: String, required: true },
  phone: { type: String, required: false},
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });


// Export the User model
module.exports = mongoose.model('User', userSchema);
