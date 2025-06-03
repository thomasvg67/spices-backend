// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 }, // <-- add quantity here
  // addedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
