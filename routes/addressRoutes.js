const express = require('express');
const router = express.Router();
const { getUserProfile, getUserAddresses, addAddress, updateAddress, updateProfile } = require('../controllers/addressController');
const verifyToken = require('../middlewares/verifyToken');
const upload = require('../middlewares/upload');

// Get user profile
router.get('/profile', verifyToken, getUserProfile);

// Get all addresses
router.get('/addresses', verifyToken, getUserAddresses);

// Add new address
router.post('/addresses', verifyToken, addAddress);

// Update an address by ID
router.put('/addresses/:addressId', verifyToken, updateAddress);


router.put('/updateProfile', verifyToken, upload.single('profilePicture'), updateProfile);


module.exports = router;
