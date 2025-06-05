const Review = require('../models/Review');

// Add review (default isVisible = false)
exports.addReview = async (req, res) => {
  try {
    const userId = null;
    const { name, email, review, rating } = req.body;
    const productId = req.params.productId;

    if (!name || !review || !rating) {
      return res.status(400).json({ message: 'Name, message, and rating are required' });
    }

    let photo = '';
    if (req.file) {
      photo = req.file.filename;
    }

    const newReview = new Review({
      userId,
      productId,
      name,
      email,
      review,
      rating,
      photo,
      isVisible: false,
    });

    await newReview.save();

    res.status(201).json({ message: 'Review submitted and pending approval' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get visible reviews for product (only isVisible = true)
exports.getProductReviews = async (req, res) => {
  try {
    const productId = req.params.productId;
    const reviews = await Review.find({ productId, isVisible: true }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews with product info for admin
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('productId', 'name images')
      .sort({ createdAt: -1 });

    const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

    const formattedReviews = reviews.map((review) => {
      const reviewObj = review.toObject();
      if (reviewObj.photo) {
        reviewObj.photoUrl = `${BASE_URL}/uploads/${reviewObj.photo}`;
      }
      return reviewObj;
    });

    res.status(200).json(formattedReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle review visibility (admin)
exports.toggleReviewVisibility = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const { isVisible } = req.body;

    if (typeof isVisible !== 'boolean') {
      return res.status(400).json({ message: 'isVisible must be boolean' });
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { isVisible },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review visibility updated', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isVisible: true }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};