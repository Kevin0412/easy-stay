const pool = require('../config/database');

async function create(order_data) {
  const { user_id, hotel_id, room_id, check_in, check_out, nights, total_price } = order_data;
  const [result] = await pool.query(
    'INSERT INTO orders (user_id, hotel_id, room_id, check_in, check_out, nights, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [user_id, hotel_id, room_id, check_in, check_out, nights, total_price, 'confirmed']
  );
  return result;
}

async function findByUser(user_id) {
  const [rows] = await pool.query(
    'SELECT o.*, h.name_cn as hotel_name, r.room_type FROM orders o JOIN hotels h ON o.hotel_id = h.id JOIN rooms r ON o.room_id = r.id WHERE o.user_id = ? ORDER BY o.created_at DESC',
    [user_id]
  );
  return rows;
}

module.exports = { create, findByUser };
