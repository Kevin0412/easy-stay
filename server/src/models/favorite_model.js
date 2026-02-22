const pool = require('../config/database');

async function add(user_id, hotel_id) {
  const [result] = await pool.query(
    'INSERT IGNORE INTO favorites (user_id, hotel_id) VALUES (?, ?)',
    [user_id, hotel_id]
  );
  return result;
}

async function remove(user_id, hotel_id) {
  const [result] = await pool.query(
    'DELETE FROM favorites WHERE user_id = ? AND hotel_id = ?',
    [user_id, hotel_id]
  );
  return result;
}

async function findByUser(user_id) {
  const [rows] = await pool.query(
    `SELECT h.id, h.name_cn, h.address, h.star, f.created_at
     FROM favorites f JOIN hotels h ON f.hotel_id = h.id
     WHERE f.user_id = ? ORDER BY f.created_at DESC`,
    [user_id]
  );
  return rows;
}

async function check(user_id, hotel_id) {
  const [rows] = await pool.query(
    'SELECT 1 FROM favorites WHERE user_id = ? AND hotel_id = ?',
    [user_id, hotel_id]
  );
  return rows.length > 0;
}

module.exports = { add, remove, findByUser, check };
