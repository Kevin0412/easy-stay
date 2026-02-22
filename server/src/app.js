const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
const authRoutes = require('./routes/auth_routes');
const hotelRoutes = require('./routes/hotel_routes');
const roomRoutes = require('./routes/room_routes');
const priceRoutes = require('./routes/price_routes');
const favoriteRoutes = require('./routes/favorite_routes');
const orderRoutes = require('./routes/order_routes');

app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/orders', orderRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'server_running' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'internal_server_error'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
