const express = require("express");
const router = express.Router();
const { 
  getAllUsers, 
  updateUser, 
  deleteUser, 
  getAllLaundrySubmissions, 
  updateLaundryStatus, 
  deleteLaundrySubmission ,
  getDashboardData ,
  getWeeklyStats,
  getMonthlyStats,
} = require("../controllers/adminController");

// Route to fetch all users
router.get("/users", getAllUsers); // Add authentication middleware

// Route to update a user
router.put("/users/:userId", updateUser);

// Route to delete a user
router.delete("/users/:userId", deleteUser);

// Route to fetch all laundry submissions
router.get("/laundry/submissions", getAllLaundrySubmissions);

// Route to update laundry status
router.put("/laundry/submissions/:submissionId", updateLaundryStatus);

// Route to delete a laundry submission
router.delete("/laundry/submissions/:submissionId", deleteLaundrySubmission);

router.get("/dashboard", getDashboardData);

router.get("/dashboard/weekly",getWeeklyStats);

router.get("/dashboard/monthly", getMonthlyStats);




// Export the router to use in the main app
module.exports = router;
