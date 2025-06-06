const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const orderController = require('../controllers/orderController');

// Create new order
router.post('/', verifyToken, orderController.placeOrder);

// Get orders of the logged-in user
router.get('/my', verifyToken, orderController.getUserOrders);

// Admin: Get all orders
router.get('/all', verifyToken, orderController.getAllOrders);

module.exports = router;
