const orderModel = require('../models/order_model');

async function createOrder(req, res) {
  try {
    const { hotel_id, room_id, check_in, check_out, nights, total_price } = req.body;
    if (!hotel_id || !room_id || !check_in || !check_out) {
      return res.status(400).json({ success: false, message: 'missing_required_fields' });
    }
    const result = await orderModel.create({
      user_id: req.user.user_id,
      hotel_id, room_id, check_in, check_out, nights, total_price
    });
    res.status(201).json({ success: true, data: { order_id: result.insertId }, message: 'order_created' });
  } catch (error) {
    console.error('Create order error:', error);
    if (error.message === 'room_out_of_stock') {
      return res.status(400).json({ success: false, message: 'room_out_of_stock' });
    }
    res.status(500).json({ success: false, message: 'order_creation_failed' });
  }
}

async function getMyOrders(req, res) {
  try {
    const orders = await orderModel.findByUser(req.user.user_id);
    res.json({ success: true, data: orders, message: '' });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'failed_to_fetch_orders' });
  }
}

module.exports = { createOrder, getMyOrders };
