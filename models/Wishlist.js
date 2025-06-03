const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  // addedAt: {
  //   type: Date,
  //   default: Date.now
  // }
}, { timestamps: true })

module.exports = mongoose.model('Wishlist', wishlistSchema)
