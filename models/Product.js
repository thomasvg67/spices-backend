const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  discount: Number,
  gst: Number,
  status: String,
  availability: String,
  images: [String], 
});

module.exports = mongoose.model('Product', productSchema);
