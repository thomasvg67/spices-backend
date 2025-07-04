const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const reviewController = require('../controllers/reviewController');
const upload = require('../middlewares/upload');


// Get all reviews (admin)
router.get('/admin/all', verifyToken, reviewController.getAllReviews);

// Toggle review visibility (admin)
router.patch('/:reviewId/visibility', verifyToken, reviewController.toggleReviewVisibility);

// Get all approved reviews (public)
router.get('/approved/all', reviewController.getAllApprovedReviews);

// Public: get visible reviews for product
router.get('/:productId', reviewController.getProductReviews);

// Public: add review (no auth)
router.post('/:productId', upload.single('photo'), reviewController.addReview);

module.exports = router;
