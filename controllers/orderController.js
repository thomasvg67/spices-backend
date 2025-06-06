const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

// ----- Place Order -----
exports.placeOrder = async (req, res) => {
    const userId = req.user.userId || req.user.id;
    const { selectedCartItems, note, address: addressId } = req.body;

    try {
        if (!Array.isArray(selectedCartItems) || selectedCartItems.length === 0) {
            return res.status(400).json({ message: 'No items selected for order.' });
        }

        // 🔍 Fetch user and find address by ID
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const addressDoc = user.addresses.find(addr => addr._id.toString() === addressId);
        if (!addressDoc) {
            return res.status(400).json({ message: 'Invalid address selected.' });
        }

        const fullAddress = {
            fullName: user.fullName,
            houseNo: addressDoc.houseNo,
            city: addressDoc.city,
            state: addressDoc.state,
            pincode: addressDoc.pincode,
            location: addressDoc.location,
            phone: user.phone,
        };

        // 📦 Fetch and validate selected cart items
        const cartItems = await Cart.find({ _id: { $in: selectedCartItems }, userId }).populate('productId');
        const validItems = cartItems.filter(item => item.productId);
        if (validItems.length === 0) {
            return res.status(400).json({ message: 'No valid items in cart.' });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of validItems) {
            const product = item.productId;
            const price = product.price || 0;
            const discount = product.discount || 0;
            const gst = product.gst || 0;

            const discountedPrice = price - (price * discount / 100);
            const gstAmount = discountedPrice * (gst / 100);
            const finalPrice = discountedPrice + gstAmount;

            const quantity = item.quantity || 1;
            const totalPriceForItem = finalPrice * quantity;
            totalAmount += totalPriceForItem;

            orderItems.push({
                productId: product._id,
                quantity,
                price: finalPrice.toFixed(2),
            });
        }

        const newOrder = new Order({
            userId,
            items: orderItems,
            address: fullAddress, // ✅ Saving full address
            note,
            totalAmount: parseFloat(totalAmount.toFixed(2)),
        });

        await newOrder.save();

        // 🧹 Clean up: Remove ordered items from cart
        await Cart.deleteMany({ _id: { $in: selectedCartItems }, userId });

        res.status(201).json({ message: 'Order placed successfully', orderId: newOrder._id });
    } catch (error) {
        console.error('Order placement error:', error);
        res.status(500).json({ message: 'Failed to place order', error: error.message });
    }
};

// ----- Get Orders for Logged-In User -----
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;

        const orders = await Order.find({ userId })
            .populate('items.productId')
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ message: 'Failed to get user orders' });
    }
};

// ----- Get All Orders for Admin -----
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'fullName email')
            .populate('items.productId')
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ message: 'Failed to fetch all orders' });
    }
};