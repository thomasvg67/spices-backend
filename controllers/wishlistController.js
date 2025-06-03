const Wishlist = require('../models/Wishlist'); // or whatever your model is

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'Product ID is required' });

    const existing = await Wishlist.findOne({ userId, productId });
    if (existing) return res.status(400).json({ message: 'Already in wishlist' });

    const wishlistItem = new Wishlist({ userId, productId });
    await wishlistItem.save();

    res.status(201).json({ message: 'Added to wishlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWishlistCount = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const count = await Wishlist.countDocuments({ userId });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getWishlistItems = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    // Step 1: Fetch all wishlist items
    const wishlistItems = await Wishlist.find({ userId }).populate('productId');

    // Step 2: Keep only valid items
    const validItems = wishlistItems.filter(item => item.productId !== null);

    // Step 3: Delete invalid entries
    const invalidItems = wishlistItems.filter(item => item.productId === null);
    const invalidIds = invalidItems.map(item => item._id);
    if (invalidIds.length > 0) {
      await Wishlist.deleteMany({ _id: { $in: invalidIds } });
    }

    res.status(200).json(validItems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch wishlist items' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const wishlistItemId = req.params.id;

    const deletedItem = await Wishlist.findOneAndDelete({ _id: wishlistItemId, userId });

    if (!deletedItem) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove item from wishlist' });
  }
};