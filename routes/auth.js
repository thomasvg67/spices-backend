const express = require('express');
const router = express.Router();
const User = require('../models/User'); // adjust path as needed
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    if (user.role !== 'admin')
      return res.status(403).json({ message: 'Access denied. Not an admin.' });

    // Generate JWT token with user id, email, and role
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // adjust expiration as needed
    );

    res.status(200).json({
      message: 'Login successful',
      token, // send token to frontend
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
