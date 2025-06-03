const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { productId, quantity } = req.body; // <-- fix here
    if (!productId) return res.status(400).json({ message: 'Product ID is required' });

    const qty = quantity && quantity > 0 ? quantity : 1;

    const existing = await Cart.findOne({ userId, productId });
    if (existing) return res.status(400).json({ message: 'Already in cart' });

    const cartItem = new Cart({ userId, productId, quantity: qty }); // <-- add quantity
    await cartItem.save();

    res.status(201).json({ message: 'Added to cart' });
  } catch (error) {
    console.error(error); // Add this for better server-side debugging
    res.status(500).json({ error: error.message });
  }
};

exports.getCartItems = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    // Step 1: Get all cart items
    const cartItems = await Cart.find({ userId }).populate('productId');

    // Step 2: Filter out items with missing or deleted products
    const validItems = cartItems.filter(item => item.productId !== null);

    // Step 3: Delete invalid items from DB
    const invalidItems = cartItems.filter(item => item.productId === null);
    const invalidIds = invalidItems.map(item => item._id);
    if (invalidIds.length > 0) {
      await Cart.deleteMany({ _id: { $in: invalidIds } });
    }

    res.status(200).json(validItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCartCount = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const count = await Cart.countDocuments({ userId });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove item
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const cartItemId = req.params.id;

    const deleted = await Cart.findOneAndDelete({ _id: cartItemId, userId });
    if (!deleted) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update quantity
exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const cartItemId = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const updated = await Cart.findOneAndUpdate(
      { _id: cartItemId, userId },
      { quantity },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};