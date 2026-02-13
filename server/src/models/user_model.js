const pool = require('../config/database');

/**
 * 根据用户名查找用户
 * @param {string} username - 用户名
 * @returns {Promise<Object>} 用户对象
 */
async function findByUsername(username) {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  return rows[0];
}

/**
 * 根据 ID 查找用户
 * @param {number} id - 用户 ID
 * @returns {Promise<Object>} 用户对象
 */
async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, username, role, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
}

/**
 * 创建新用户
 * @param {string} username - 用户名
 * @param {string} hashed_password - 加密后的密码
 * @param {string} role - 用户角色
 * @returns {Promise<Object>} 创建结果
 */
async function create(username, hashed_password, role = 'merchant') {
  const [result] = await pool.query(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    [username, hashed_password, role]
  );
  return result;
}

module.exports = {
  findByUsername,
  findById,
  create
};
