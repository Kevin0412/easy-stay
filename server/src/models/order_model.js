const pool = require('../config/database');

async function create(order_data) {
  const { user_id, hotel_id, room_id, check_in, check_out, nights, total_price } = order_data;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rooms] = await conn.query('SELECT stock FROM rooms WHERE id = ? FOR UPDATE', [room_id]);
    if (!rooms.length || rooms[0].stock < 1) {
      throw new Error('room_out_of_stock');
    }
    const [result] = await conn.query(
      'INSERT INTO orders (user_id, hotel_id, room_id, check_in, check_out, nights, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, hotel_id, room_id, check_in, check_out, nights, total_price, 'confirmed']
    );
    await conn.query('UPDATE rooms SET stock = stock - 1 WHERE id = ?', [room_id]);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function findByUser(user_id) {
  const [rows] = await pool.query(
    'SELECT o.*, h.name_cn as hotel_name, r.room_type FROM orders o JOIN hotels h ON o.hotel_id = h.id JOIN rooms r ON o.room_id = r.id WHERE o.user_id = ? ORDER BY o.created_at DESC',
    [user_id]
  );
  return rows;
}

module.exports = { create, findByUser };
