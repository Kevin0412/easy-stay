const pool = require('../config/database');

/**
 * 创建酒店
 */
async function create(hotel_data) {
  const { name_cn, name_en, address, star, open_date, created_by, cover_image, images, tags, facilities, nearby } = hotel_data;
  const [result] = await pool.query(
    'INSERT INTO hotels (name_cn, name_en, address, star, open_date, created_by, status, cover_image, images, tags, facilities, nearby) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name_cn, name_en, address, star, open_date, created_by, 'draft', cover_image || null, images || null, tags || null, facilities || null, nearby || null]
  );
  return result;
}

/**
 * 查询酒店列表
 */
async function findAll(filters = {}) {
  let query = 'SELECT * FROM hotels WHERE 1=1';
  const params = [];

  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.created_by) {
    query += ' AND created_by = ?';
    params.push(filters.created_by);
  }

  if (filters.star) {
    query += ' AND star = ?';
    params.push(filters.star);
  }

  if (filters.keyword) {
    query += ' AND (name_cn LIKE ? OR address LIKE ? OR tags LIKE ?)';
    params.push(`%${filters.keyword}%`, `%${filters.keyword}%`, `%${filters.keyword}%`);
  }

  if (filters.city) {
    query += ' AND address LIKE ?';
    params.push(`%${filters.city}%`);
  }

  if (filters.sort === 'hot') {
    query += ' ORDER BY (views * 0.3 + star * 0.7) DESC';
  } else {
    query += ' ORDER BY created_at DESC';
  }

  const [rows] = await pool.query(query, params);
  return rows;
}

/**
 * 根据 ID 查询酒店
 */
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM hotels WHERE id = ?', [id]);
  return rows[0];
}

/**
 * 更新酒店信息
 */
async function update(id, hotel_data) {
  const { name_cn, name_en, address, star, open_date, cover_image, images, tags, facilities, nearby } = hotel_data;
  const [result] = await pool.query(
    'UPDATE hotels SET name_cn = ?, name_en = ?, address = ?, star = ?, open_date = ?, cover_image = ?, images = ?, tags = ?, facilities = ?, nearby = ? WHERE id = ?',
    [name_cn, name_en, address, star, open_date, cover_image || null, images || null, tags || null, facilities || null, nearby || null, id]
  );
  return result;
}

/**
 * 更新酒店状态
 */
async function updateStatus(id, status) {
  const [result] = await pool.query(
    'UPDATE hotels SET status = ? WHERE id = ?',
    [status, id]
  );
  return result;
}

/**
 * 审核不通过（记录原因）
 */
async function rejectWithReason(id, reason) {
  const [result] = await pool.query(
    'UPDATE hotels SET status = ?, reject_reason = ? WHERE id = ?',
    ['rejected', reason, id]
  );
  return result;
}

/**
 * 清空拒绝原因（通过或恢复时调用）
 */
async function clearRejectReason(id) {
  const [result] = await pool.query(
    'UPDATE hotels SET reject_reason = NULL WHERE id = ?',
    [id]
  );
  return result;
}

/**
 * 删除酒店
 */
async function deleteById(id) {
  const [result] = await pool.query('DELETE FROM hotels WHERE id = ?', [id]);
  return result;
}

/**
 * 增加浏览量
 */
async function incrementViews(id) {
  await pool.query('UPDATE hotels SET views = views + 1 WHERE id = ?', [id]);
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  updateStatus,
  rejectWithReason,
  clearRejectReason,
  deleteById,
  incrementViews
};
