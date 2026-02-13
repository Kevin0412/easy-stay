require('dotenv').config();

// 使用 mock 数据库进行测试
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
