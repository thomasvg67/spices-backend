const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/user', require('./routes/addressRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'))
app.use('/api/wishlist', require('./routes/wishlistRoutes'))
app.use('/api/reviews', require('./routes/reviewRoutes'));

app.use('/api', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
