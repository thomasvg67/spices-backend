const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  email: { type: String },
  review: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  isVisible: { type: Boolean, default: false },  // NEW FIELD
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);
