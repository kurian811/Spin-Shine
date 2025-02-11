const LaundrySubmission = require('../models/laundrySubmission');
const jwt = require('jsonwebtoken');

// Add a new laundry submission
const addLaundrySubmission = async (req, res) => {
  const { numberOfClothes, items } = req.body;
  const userId = req.user.id; // Assuming user ID is extracted from the JWT token

  try {
    // Get the current date
    const currentDate = new Date();

    // Check if the user has already submitted laundry within the past 7 days
    const existingSubmission = await LaundrySubmission.findOne({
      userId,
      submissionDate: {
        $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)), // 7 days ago
      },
    });

    if (existingSubmission) {
      return res.status(400).json({
        message: 'You have already submitted your laundry this week.',
      });
    }

    // Create a new submission if no submission exists within the past 7 days
    const newSubmission = new LaundrySubmission({
      userId,
      numberOfClothes,
      items,
      submissionDate: new Date(),
      status: 'Submitted', // Default status is 'Submitted'
    });

    await newSubmission.save();
    res.status(201).json({ message: 'Laundry submission added successfully!', submission: newSubmission });
  } catch (err) {
    console.error('Error adding laundry submission:', err);
    res.status(500).json({ message: 'Failed to add laundry submission', error: err.message });
  }
};

// Get Laundry Submission Status for the current user
const getLaundrySubmissionStatus = async (req, res) => {
  const userId = req.user.id; // Extract user ID from JWT token

  try {
    const submission = await LaundrySubmission.findOne({ userId }).sort({ submissionDate: -1 });

    if (!submission) {
      return res.status(404).json({ message: "No laundry submission found for this user." });
    }

    res.status(200).json({
      submissionDate: submission.submissionDate,
      numberOfClothes: submission.numberOfClothes,
      items: submission.items,
      status: submission.status || 'Submitted', // Return current status or default to 'Submitted'
    });
  } catch (err) {
    console.error("Error fetching laundry submission status:", err);
    res.status(500).json({ message: "Failed to fetch laundry submission status", error: err.message });
  }
};

// Edit Laundry Submission
const editLaundrySubmission = async (req, res) => {
  const userId = req.user.id; // Extract user ID from JWT token
  const { numberOfClothes, items } = req.body;

  try {
    const submission = await LaundrySubmission.findOne({ userId }).sort({ submissionDate: -1 });

    if (!submission) {
      return res.status(404).json({ message: "No laundry submission found to edit." });
    }

    // Prevent editing if status is not 'Submitted'
    if (submission.status !== 'Submitted') {
      return res.status(400).json({ message: "You cannot edit a submission with status " + submission.status });
    }

    // Update submission details
    submission.numberOfClothes = numberOfClothes;
    submission.items = items;
    submission.submissionDate = new Date(); // Update submission date to current time

    await submission.save();

    res.status(200).json({ message: 'Laundry submission updated successfully!', submission });
  } catch (err) {
    console.error("Error editing laundry submission:", err);
    res.status(500).json({ message: "Failed to edit laundry submission", error: err.message });
  }
};

// Delete Laundry Submission
const deleteLaundrySubmission = async (req, res) => {
  const userId = req.user.id;

  try {
    const submission = await LaundrySubmission.findOne({ userId }).sort({ submissionDate: -1 });

    if (!submission) {
      return res.status(404).json({ message: "No laundry submission found to delete." });
    }

    // Prevent deletion if status is not 'Submitted'
    if (submission.status !== 'Submitted') {
      return res.status(400).json({ message: "You cannot delete a submission with status " + submission.status });
    }

    await LaundrySubmission.findOneAndDelete({ userId });

    res.status(200).json({ message: "Laundry submission deleted successfully!" });
  } catch (err) {
    console.error("Error during deletion process:", err);
    res.status(500).json({
      message: "Failed to delete laundry submission",
      error: err.message || "Unknown error",
    });
  }
};

// Admin can change laundry status (pending, completed)
const changeLaundryStatus = async (req, res) => {
  const { userId, status } = req.body; // Assume admin provides userId and status (pending/completed)

  try {
    // Check if the user has a laundry submission
    const submission = await LaundrySubmission.findOne({ userId }).sort({ submissionDate: -1 });

    if (!submission) {
      return res.status(404).json({ message: "No laundry submission found for this user." });
    }

    // Validate the new status
    if (!['Pending', 'Completed'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value. Status must be 'Pending' or 'Completed'." });
    }

    // Update the status
    submission.status = status;

    await submission.save();

    res.status(200).json({ message: `Laundry status updated to ${status} successfully!`, submission });
  } catch (err) {
    console.error("Error changing laundry status:", err);
    res.status(500).json({ message: "Failed to change laundry status", error: err.message });
  }
};

module.exports = {
  addLaundrySubmission,
  getLaundrySubmissionStatus,
  editLaundrySubmission,
  deleteLaundrySubmission,
  changeLaundryStatus,
};
