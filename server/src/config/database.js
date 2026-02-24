require('dotenv').config();

// Mock 数据库已废弃，仅用于早期无 MySQL 环境时的开发调试
// 正式环境请确保 USE_MOCK_DB 未设置或为 false
const USE_MOCK = process.env.USE_MOCK_DB === 'true';

let pool;

if (USE_MOCK) {
  console.log('Using MOCK database');
  pool = require('./mock_database');
} else {
  console.log('Using MySQL database');
  const mysql = require('mysql2/promise');
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

module.exports = pool;
