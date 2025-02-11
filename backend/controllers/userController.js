const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');
const crypto = require("crypto");


const nodemailer = require('nodemailer');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can also use 'Outlook', 'Yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Controller to handle user registration
const registerUser = async (req, res) => {
  const { fullName, email, password, roomNumber, laundryId, phone } = req.body;

  try {
    // Validate required fields
    if (!fullName || !email || !password || !roomNumber || !laundryId || !phone) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Validate phone number (must be numeric and 10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format. Must be 10 digits.' });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists!' });
    }

    // Hash password before saving to DB
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      roomNumber,
      laundryId,
      phone,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error('Error registering user:', err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }

    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// Controller for user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found. Please register.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        roomNumber: user.roomNumber,
        laundryId: user.laundryId,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Controller for forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message: 'If an account exists with this email, a password reset link will be sent.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpires = resetTokenExpiry;
    
    console.log('Token expiry set to:', resetTokenExpiry);
    
    await user.save();

    // Generate reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Email content
    const mailOptions = {
      from: `"Laundry Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hello ${user.fullName || 'User'},</p>
          <p>You requested to reset your password. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetUrl}" 
               style="background-color: #4CAF50; color: white; padding: 12px 25px; 
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If you didn't request this change, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
          <p>Best regards,<br>Your Laundry Team</p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'If an account exists with this email, a password reset link will be sent.',
    });

  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({
      message: 'Unable to process password reset request. Please try again later.',
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Log the token for debugging
    console.log('Received token:', token);

    // Hash the provided token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    console.log('Hashed token:', hashedToken);

    // Find user with valid token and add logging
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    console.log('Found user:', user);
    console.log('Current time:', Date.now());
    console.log('Token expiry:', user?.resetPasswordExpires);

    if (!user) {
      return res.status(400).json({
        message: 'Password reset link is invalid or has expired. Please request a new one.'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user's password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Generate new login token
    const loginToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Password has been reset successfully.',
      token: loginToken
    });

  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ 
      message: 'Failed to reset password. Please try again.' 
    });
  }
};


// Existing controllers...
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('fullName email phone roomNumber laundryId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user profile', error: err.message });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const { id } = req.user;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirmation do not match.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    if (req.body.phone) {
      user.phone = req.body.phone;
    }

    await user.save();
    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Failed to change password', error: err.message });
  }
};

const updateUserProfile = async (req, res) => {
  const { fullName, roomNumber, laundryId, phone } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format. Must be 10 digits.' });
    }

    if (fullName) user.fullName = fullName;
    if (roomNumber) user.roomNumber = roomNumber;
    if (laundryId) user.laundryId = laundryId;
    if (phone) user.phone = phone;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully.', user });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  changePassword,
  updateUserProfile,
};