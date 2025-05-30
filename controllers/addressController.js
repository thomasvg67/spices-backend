const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get full user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;// assuming userId is set by verifyToken middleware
    const user = await User.findById(userId).select('-password'); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get user's addresses
exports.getUserAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('addresses');
    res.json(user.addresses || []);
  } catch (err) {
    res.status(500).json({ message: "Error fetching addresses" });
  }
};

// Add a new address
exports.addAddress = async (req, res) => {
  try {
    const { state, city, houseNo, pincode, location } = req.body;
    const user = await User.findById(req.user.userId);

    const newAddress = { state, city, houseNo, pincode, location };
    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json(newAddress);
  } catch (err) {
    res.status(500).json({ message: "Error adding address" });
  }
};


exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;
    const { state, city, houseNo, pincode, location } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find the address by id in the addresses array
    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    // Update address fields
    address.state = state || address.state;
    address.city = city || address.city;
    address.houseNo = houseNo || address.houseNo;
    address.pincode = pincode || address.pincode;
    address.location = location || address.location;

    await user.save();

    res.json(address);
  } catch (err) {
    res.status(500).json({ message: "Error updating address" });
  }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId; 
        const { fullName, email, phone, currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update name, email, and phone
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (phone) user.phone = phone;

        // If password change is requested
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();
        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
            },
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};