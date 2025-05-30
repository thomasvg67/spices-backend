const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const verifyToken = require('../middlewares/verifyToken');


router.post('/', verifyToken, cartController.addToCart);
router.get('/items', verifyToken, cartController.getCartItems);
router.get('/count', verifyToken, cartController.getCartCount);
router.delete('/:id',verifyToken, cartController.removeFromCart);
router.patch('/:id/quantity',verifyToken, cartController.updateQuantity);

module.exports = router;
