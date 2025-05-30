const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken');
const wishlistController = require('../controllers/wishlistController')

router.post('/', verifyToken, wishlistController.addToWishlist);
router.get('/count', verifyToken, wishlistController.getWishlistCount);
router.get('/items', verifyToken, wishlistController.getWishlistItems);
router.delete('/:id', verifyToken, wishlistController.removeFromWishlist);

module.exports = router
