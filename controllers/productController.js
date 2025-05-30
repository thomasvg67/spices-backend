const Product = require('../models/Product');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Add product
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      discount,
      gst,
      status,
      availability,
    } = req.body;

     const images = req.files.map(file => file.filename);

    const product = new Product({
      name,
      price,
      description,
      images,
      discount,
      gst,
      status,
      availability,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
};

// Update product by ID
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      name,
      price,
      description,
      discount,
      gst,
      status,
      availability,
    } = req.body;

    // Find the product first
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update text fields
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.discount = discount || product.discount;
    product.gst = gst || product.gst;
    product.status = status || product.status;
    product.availability = availability || product.availability;

    // If new images are uploaded, replace old images with new ones
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.filename);
      product.images = newImages;
    }

    await product.save();

    res.json(product);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
};


// controllers/productController.js
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting product" });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};
