const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const laundrySubmissionController = require('../controllers/laundrySubmissionController');

// Route to submit laundry
router.post('/submit', authenticateToken, laundrySubmissionController.addLaundrySubmission);

// Route to get laundry submission status
router.get('/status', authenticateToken, laundrySubmissionController.getLaundrySubmissionStatus);

// Route to edit laundry submission
router.put('/edit', authenticateToken, laundrySubmissionController.editLaundrySubmission);

// Route to delete laundry submission
router.delete('/delete', authenticateToken, laundrySubmissionController.deleteLaundrySubmission);

module.exports = router;
