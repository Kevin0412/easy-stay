const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order_controller');
const { authenticate } = require('../middleware/auth_middleware');

router.post('/', authenticate, orderController.createOrder);
router.get('/', authenticate, orderController.getMyOrders);

module.exports = router;
