const pool = require('../config/database');

/**
 * 创建价格策略
 */
async function create(price_data) {
  const { hotel_id, room_id, strategy_name, discount, start_date, end_date } = price_data;
  const [result] = await pool.query(
    'INSERT INTO price_strategies (hotel_id, room_id, strategy_name, discount, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
    [hotel_id, room_id, strategy_name, discount, start_date, end_date]
  );
  return result;
}

/**
 * 查询酒店的价格策略
 */
async function findByHotelId(hotel_id) {
  const [rows] = await pool.query(
    'SELECT * FROM price_strategies WHERE hotel_id = ? ORDER BY start_date DESC',
    [hotel_id]
  );
  return rows;
}

/**
 * 根据 ID 查询价格策略
 */
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM price_strategies WHERE id = ?', [id]);
  return rows[0];
}

/**
 * 更新价格策略
 */
async function update(id, price_data) {
  const { strategy_name, discount, start_date, end_date } = price_data;
  const [result] = await pool.query(
    'UPDATE price_strategies SET strategy_name = ?, discount = ?, start_date = ?, end_date = ? WHERE id = ?',
    [strategy_name, discount, start_date, end_date, id]
  );
  return result;
}

/**
 * 删除价格策略
 */
async function deleteById(id) {
  const [result] = await pool.query('DELETE FROM price_strategies WHERE id = ?', [id]);
  return result;
}

/**
 * 计算指定日期范围的价格
 * @param {number} room_id - 房型 ID
 * @param {string} start_date - 开始日期
 * @param {string} end_date - 结束日期
 * @returns {Promise<number>} 总价格（单位：分）
 */
async function calculatePrice(room_id, start_date, end_date) {
  const [room_rows] = await pool.query('SELECT price FROM rooms WHERE id = ?', [room_id]);
  if (!room_rows.length) return 0;

  const base_price = parseFloat(room_rows[0].price);

  const [strategy_rows] = await pool.query(
    'SELECT discount FROM price_strategies WHERE room_id = ? AND start_date <= ? AND end_date >= ?',
    [room_id, end_date, start_date]
  );

  const discount = strategy_rows.length > 0 ? parseFloat(strategy_rows[0].discount) : 1;
  const days = Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24));

  return parseFloat((base_price * discount * days).toFixed(2));
}

module.exports = {
  create,
  findByHotelId,
  findById,
  update,
  deleteById,
  calculatePrice
};
