const User = require("../models/User");
const Laundry = require("../models/laundrySubmission");

// Function to get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }
    res.status(200).json({ users });
  } catch (err) {
    console.error("Error fetching all users:", err);
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// Function to update user information
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { fullName, email } = req.body; // Fields to update

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update user fields
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Failed to update user", error: err.message });
  }
};

// Function to delete a user
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};

/// Function to get all laundry submissions with clothes/items
const getAllLaundrySubmissions = async (req, res) => {
  try {
    const submissions = await Laundry.find()
      .populate('userId', 'fullName email') // Populate user details
      .populate('items', 'itemName quantity') // Populate the items/clothes details (assuming 'items' is the field)
    
    if (!submissions || submissions.length === 0) {
      return res.status(404).json({ message: "No laundry submissions found." });
    }
    res.status(200).json({ submissions });
  } catch (err) {
    console.error("Error fetching laundry submissions:", err);
    res.status(500).json({ message: "Failed to fetch laundry submissions", error: err.message });
  }
};

// Function to update laundry status
const updateLaundryStatus = async (req, res) => {
  const { submissionId } = req.params;
  const { status } = req.body; // e.g., 'Pending', 'In Progress', 'Completed'

  try {
    const submission = await Laundry.findByIdAndUpdate(submissionId)
      .populate('userId', 'fullName email') // Populate user details
      .populate('items', 'itemName quantity'); // Populate the items/clothes details
    
    if (!submission) {
      return res.status(404).json({ message: "Laundry submission not found." });
    }

    // Update the status field
    submission.status = status || submission.status;

    await submission.save();
    res.status(200).json({
      message: "Laundry status updated successfully",
      submission,
    });
  } catch (err) {
    console.error("Error updating laundry status:", err);
    res.status(500).json({ message: "Failed to update laundry status", error: err.message });
  }
};


// Function to delete a laundry submission
const deleteLaundrySubmission = async (req, res) => {
  const { submissionId } = req.params;

  try {
    const submission = await Laundry.findByIdAndDelete(submissionId);

    if (!submission) {
      return res.status(404).json({ message: "Laundry submission not found." });
    }

    res.status(200).json({ message: "Laundry submission deleted successfully" });
  } catch (err) {
    console.error("Error deleting laundry submission:", err);
    res.status(500).json({ message: "Failed to delete laundry submission", error: err.message });
  }
};

const getDashboardData = async (req, res) => {
  try {
    // Count total submissions, pending, and completed
    const totalSubmissions = await Laundry.countDocuments();
    const pendingSubmissions = await Laundry.countDocuments({ status: "Pending" });
    const completedSubmissions = await Laundry.countDocuments({ status: "Completed" });
    const totalUsers = await User.countDocuments(); // Count total users

    // Get recent submissions (for example, last 5) and populate userId field with fullName
    const recentSubmissions = await Laundry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'fullName');  // Populate the fullName from the User model

    // Send response with populated data
    res.status(200).json({
      totalSubmissions,
      pendingSubmissions,
      completedSubmissions,
      totalUsers, // Include total users
      recentSubmissions,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data", error: error.message });
  }
};

const getWeeklyStats = async (req, res) => {
  try {
    const weeklyStats = await Laundry.aggregate([
      {
        $group: {
          _id: { $week: "$submissionDate" }, // Get the week number
          submissions: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
        },
      },
      { $sort: { "_id": 1 } },
      {
        $project: {
          _id: 0, 
          period: { $concat: ["Week ", { $toString: "$_id" }] }, // Format "Week 1", "Week 2"
          submissions: 1,
          completed: 1,
          pending: 1
        }
      }
    ]);

    console.log("Weekly Stats:", weeklyStats); // Debugging log
    res.json(weeklyStats || []); // Ensure an array is always returned
  } catch (error) {
    console.error("Error fetching weekly stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMonthlyStats = async (req, res) => {
  try {
    const monthlyStats = await Laundry.aggregate([
      {
        $group: {
          _id: { $month: "$submissionDate" }, // Get the month number
          submissions: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
        },
      },
      { $sort: { "_id": 1 } },
      {
        $project: {
          _id: 0,
          period: { 
            $switch: { // Convert numbers to month names
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "January" },
                { case: { $eq: ["$_id", 2] }, then: "February" },
                { case: { $eq: ["$_id", 3] }, then: "March" },
                { case: { $eq: ["$_id", 4] }, then: "April" },
                { case: { $eq: ["$_id", 5] }, then: "May" },
                { case: { $eq: ["$_id", 6] }, then: "June" },
                { case: { $eq: ["$_id", 7] }, then: "July" },
                { case: { $eq: ["$_id", 8] }, then: "August" },
                { case: { $eq: ["$_id", 9] }, then: "September" },
                { case: { $eq: ["$_id", 10] }, then: "October" },
                { case: { $eq: ["$_id", 11] }, then: "November" },
                { case: { $eq: ["$_id", 12] }, then: "December" },
              ],
              default: "Unknown"
            }
          },
          submissions: 1,
          completed: 1,
          pending: 1
        }
      }
    ]);

    console.log("Monthly Stats:", monthlyStats); // Debugging log
    res.json(monthlyStats || []);
  } catch (error) {
    console.error("Error fetching monthly stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
  getAllLaundrySubmissions,
  updateLaundryStatus,
  deleteLaundrySubmission,
  getDashboardData,
  getWeeklyStats, 
  getMonthlyStats,
};
