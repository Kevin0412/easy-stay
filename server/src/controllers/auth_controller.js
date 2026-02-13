const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user_model');

/**
 * 用户注册
 */
async function register(req, res) {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'username_and_password_required'
      });
    }

    const existing_user = await userModel.findByUsername(username);
    if (existing_user) {
      return res.status(400).json({
        success: false,
        message: 'username_already_exists'
      });
    }

    const hashed_password = await bcrypt.hash(password, 10);
    const result = await userModel.create(username, hashed_password, role || 'merchant');

    res.status(201).json({
      success: true,
      data: { user_id: result.insertId },
      message: 'user_registered_successfully'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'registration_failed'
    });
  }
}

/**
 * 用户登录
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'username_and_password_required'
      });
    }

    const user = await userModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'invalid_credentials'
      });
    }

    const is_valid = await bcrypt.compare(password, user.password);
    if (!is_valid) {
      return res.status(401).json({
        success: false,
        message: 'invalid_credentials'
      });
    }

    const token = jwt.sign(
      { user_id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      },
      message: 'login_successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'login_failed'
    });
  }
}

module.exports = {
  register,
  login
};
