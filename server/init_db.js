/**
 * 初始化数据库：将 mock_database 中的数据导入 MySQL
 * 用法: node init_db.js
 */
require('dotenv').config();
const mysql = require('mysql2/promise');
const { mock_data } = require('./src/config/mock_database');

async function init() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'easy_stay',
    port: process.env.DB_PORT || 3306,
    multipleStatements: true
  });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 清空旧数据（按外键顺序）
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    for (const t of ['orders', 'favorites', 'price_strategies', 'rooms', 'hotels', 'users']) {
      await conn.query(`TRUNCATE TABLE ${t}`);
    }
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    // 插入用户
    for (const u of mock_data.users) {
      await conn.query(
        'INSERT INTO users (id, username, password, email, phone, role, created_at) VALUES (?,?,?,?,?,?,?)',
        [u.id, u.username, u.password, u.email || null, u.phone || null, u.role, u.created_at]
      );
    }

    // 插入酒店
    for (const h of mock_data.hotels) {
      await conn.query(
        'INSERT INTO hotels (id, name_cn, name_en, address, star, open_date, cover_image, images, tags, nearby, status, created_by, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [h.id, h.name_cn, h.name_en || null, h.address, h.star, h.open_date || null,
         h.cover_image || null, h.images || null, h.tags || null, h.nearby || null,
         h.status, h.created_by, h.created_at, h.updated_at]
      );
    }

    // 插入房型
    for (const r of mock_data.rooms) {
      await conn.query(
        'INSERT INTO rooms (id, hotel_id, room_type, price, stock, created_at, updated_at) VALUES (?,?,?,?,?,?,?)',
        [r.id, r.hotel_id, r.room_type, r.price, r.stock, r.created_at, r.updated_at]
      );
    }

    // 插入价格策略
    for (const p of mock_data.price_strategies) {
      await conn.query(
        'INSERT INTO price_strategies (id, hotel_id, room_id, strategy_name, discount, start_date, end_date, created_at) VALUES (?,?,?,?,?,?,?,?)',
        [p.id, p.hotel_id, p.room_id, p.strategy_name, p.discount, p.start_date, p.end_date, p.created_at]
      );
    }

    await conn.commit();
    console.log('✓ 数据库初始化完成');
    console.log(`  用户: ${mock_data.users.length} 条`);
    console.log(`  酒店: ${mock_data.hotels.length} 条`);
    console.log(`  房型: ${mock_data.rooms.length} 条`);
    console.log(`  价格策略: ${mock_data.price_strategies.length} 条`);
  } catch (err) {
    await conn.rollback();
    console.error('✗ 初始化失败:', err.message);
    process.exit(1);
  } finally {
    conn.release();
    await pool.end();
  }
}

init();
