const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    address: {
        fullName: String,
        houseNo: String,
        city: String,
        state: String,
        pincode: String,
        location: String,
        phone: String,
    },
    note: { type: String },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, default: 'pending' },
    orderStatus: { type: String, default: 'processing' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
