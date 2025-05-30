const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/upload');

// Get all products
router.get('/', productController.getProducts);

// Add a new product
router.post('/', upload.array('images', 4), productController.addProduct);

// Get product by ID
router.get('/:id', productController.getProductById);

// Update a product by ID
router.put('/:id', upload.array('images', 4), productController.updateProduct);


// Delete a product by ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;
