const mongoose = require('mongoose');

const sellerFeedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('SellerFeedback', sellerFeedbackSchema);
