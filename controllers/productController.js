const Product = require('../models/Product');
const Review = require('../models/Review');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).lean(); // use lean() for performance

    const productIds = products.map(p => p._id);
    const reviews = await Review.find({ productId: { $in: productIds } });

    const ratingsMap = {};
    productIds.forEach(id => {
      const productReviews = reviews.filter(r => r.productId.toString() === id.toString());
      const average = productReviews.length
        ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
        : 0;
      ratingsMap[id] = Math.round(average * 2) / 2;
    });

    const productsWithRating = products.map(p => ({
      ...p,
      averageRating: ratingsMap[p._id] || 0,
    }));

    res.json(productsWithRating);
  } catch (err) {
    console.error('Failed to fetch products with ratings:', err);
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
      bestSeller,
    } = req.body;

    const images = req.files.map(file => file.filename);

    // Check if bestSeller is true and the limit is reached
    if (bestSeller === 'true') {
      const bestSellerCount = await Product.countDocuments({ bestSeller: true });
      if (bestSellerCount >= 8) {
        return res.status(400).json({ error: 'Best seller is full' });
      }
    }

    const product = new Product({
      name,
      price,
      description,
      images,
      discount,
      gst,
      status,
      availability,
      bestSeller: bestSeller === 'true', // ensure boolean
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
      bestSeller,
    } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // If setting bestSeller to true and it's not already true
    if (bestSeller === 'true' && product.bestSeller !== true) {
      const bestSellerCount = await Product.countDocuments({ bestSeller: true });
      if (bestSellerCount >= 8) {
        return res.status(400).json({ error: "Best seller is full" });
      }
    }

    // Update fields
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.discount = discount || product.discount;
    product.gst = gst || product.gst;
    product.status = status || product.status;
    product.availability = availability || product.availability;
    product.bestSeller = bestSeller === 'true'; // ensure boolean

    // Replace images if new ones are uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.filename);
      product.images = newImages;
    }

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete product
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
