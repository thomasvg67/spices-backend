// models/User.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  state: String,
  city: String,
  houseNo: String,
  pincode: String,
  location: String
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  profilePicture: { type: String },
  addresses: [addressSchema] // Now supports multiple addresses
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
