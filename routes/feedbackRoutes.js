const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/seller', verifyToken, feedbackController.submitSellerFeedback);
router.post('/delivery', verifyToken, feedbackController.submitDeliveryFeedback);
router.get('/seller', verifyToken, feedbackController.getSellerFeedbacks);
router.get('/delivery', verifyToken, feedbackController.getDeliveryFeedbacks);

module.exports = router;
