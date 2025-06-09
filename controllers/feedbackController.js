const SellerFeedback = require('../models/SellerFeedback');
const DeliveryFeedback = require('../models/DeliveryFeedback');

exports.submitSellerFeedback = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { sellerId, rating, comment } = req.body;

    if (!sellerId || !rating) return res.status(400).json({ message: 'Seller ID and rating required' });

    const feedback = new SellerFeedback({ userId, sellerId, rating, comment });
    await feedback.save();

    res.status(201).json({ message: 'Seller feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.submitDeliveryFeedback = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { orderId, rating, comment } = req.body;

    if (!orderId || !rating) return res.status(400).json({ message: 'Order ID and rating required' });

    const feedback = new DeliveryFeedback({ userId, orderId, rating, comment });
    await feedback.save();

    res.status(201).json({ message: 'Delivery feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSellerFeedbacks = async (req, res) => {
  try {
    const feedbacks = await SellerFeedback.find().sort({ createdAt: -1 }).populate('userId','fullName');
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDeliveryFeedbacks = async (req, res) => {
  try {
    const feedbacks = await DeliveryFeedback.find().sort({ createdAt: -1 }).populate('userId','fullName');
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};