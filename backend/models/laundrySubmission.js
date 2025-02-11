const mongoose = require('mongoose');

const laundrySubmissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    submissionDate: { type: Date, default: Date.now },
    numberOfClothes: { type: Number, required: true, max: 20 },
    items: {
      Shirt: { type: Number, default: 0 },
      Pant: { type: Number, default: 0 },
      Jeans: { type: Number, default: 0 },
      Tshirt: { type: Number, default: 0 },
      PlayPant: { type: Number, default: 0 },
      Bermuda: { type: Number, default: 0 },
      InnerBan: { type: Number, default: 0 },
      Bedsheet: { type: Number, default: 0 },
      Blanket: { type: Number, default: 0 },
      Lunkey: { type: Number, default: 0 },
      Overcoat: { type: Number, default: 0 },
      Thorth: { type: Number, default: 0 },
      Turkey: { type: Number, default: 0 },
      Pillow: { type: Number, default: 0 },
      Sweater: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['Submitted', 'Pending', 'Completed'],
      default: 'Submitted', // Default to 'Submitted'
    },
});

// Export the Laundry Submission model
module.exports = mongoose.model('LaundrySubmission', laundrySubmissionSchema);
