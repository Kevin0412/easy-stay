const pool = require('../config/database');

/**
 * 创建房型
 */
async function create(room_data) {
  const { hotel_id, room_type, price, stock, image } = room_data;
  const [result] = await pool.query(
    'INSERT INTO rooms (hotel_id, room_type, price, stock, image) VALUES (?, ?, ?, ?, ?)',
    [hotel_id, room_type, price, stock, image || null]
  );
  return result;
}

/**
 * 查询酒店的所有房型
 */
async function findByHotelId(hotel_id) {
  const [rows] = await pool.query(
    'SELECT * FROM rooms WHERE hotel_id = ? ORDER BY price ASC',
    [hotel_id]
  );
  return rows;
}

/**
 * 根据 ID 查询房型
 */
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM rooms WHERE id = ?', [id]);
  return rows[0];
}

/**
 * 更新房型信息
 */
async function update(id, room_data) {
  const { room_type, price, stock, image } = room_data;
  const [result] = await pool.query(
    'UPDATE rooms SET room_type = ?, price = ?, stock = ?, image = ? WHERE id = ?',
    [room_type, price, stock, image !== undefined ? image : null, id]
  );
  return result;
}

/**
 * 删除房型
 */
async function deleteById(id) {
  const [result] = await pool.query('DELETE FROM rooms WHERE id = ?', [id]);
  return result;
}

module.exports = {
  create,
  findByHotelId,
  findById,
  update,
  deleteById
};
