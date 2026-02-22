-- 创建数据库
CREATE DATABASE IF NOT EXISTS easy_stay CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE easy_stay;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  role ENUM('admin', 'merchant', 'user') NOT NULL DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 酒店表
CREATE TABLE IF NOT EXISTS hotels (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name_cn VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),
  address VARCHAR(255) NOT NULL,
  star INT DEFAULT 0,
  open_date DATE,
  cover_image VARCHAR(500),
  images TEXT,
  status ENUM('draft', 'pending', 'published', 'rejected', 'offline') NOT NULL DEFAULT 'draft',
  reject_reason VARCHAR(500),
  created_by INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 房型表
CREATE TABLE IF NOT EXISTS rooms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  hotel_id INT NOT NULL,
  room_type VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  INDEX idx_hotel_id (hotel_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 价格策略表
CREATE TABLE IF NOT EXISTS price_strategies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  hotel_id INT NOT NULL,
  room_id INT,
  strategy_name VARCHAR(100) NOT NULL,
  discount DECIMAL(3, 2) NOT NULL DEFAULT 1.00,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  INDEX idx_hotel_id (hotel_id),
  INDEX idx_date_range (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入默认管理员账户（密码: admin123）
INSERT INTO users (username, password, role) VALUES
('admin', '$2a$10$i6mRBBF6b8hR1q9ex3ttIOsrCF3UlW1agdR1.8TlzS5YAaV8JM8z6', 'admin');

-- 插入测试用户账户（密码: user123）
INSERT INTO users (username, password, email, phone, role) VALUES
('testuser', '$2a$10$i6mRBBF6b8hR1q9ex3ttIOsrCF3UlW1agdR1.8TlzS5YAaV8JM8z6', 'test@example.com', '13800138000', 'user');

-- 如果表已存在，添加新字段的迁移脚本
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'merchant', 'user') NOT NULL DEFAULT 'user';

-- hotels 表迁移：添加 rejected 状态和 reject_reason 字段
ALTER TABLE hotels MODIFY COLUMN status ENUM('draft', 'pending', 'published', 'rejected', 'offline') NOT NULL DEFAULT 'draft';
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS reject_reason VARCHAR(500);

-- 收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  hotel_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_hotel (user_id, hotel_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
