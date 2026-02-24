const favoriteModel = require('../models/favorite_model');

/**
 * 添加酒店收藏
 * @param {Object} req - 请求对象，body 包含 hotel_id
 * @param {Object} res - 响应对象
 */
async function addFavorite(req, res) {
  try {
    const { hotel_id } = req.body;
    await favoriteModel.add(req.user.user_id, hotel_id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * 取消酒店收藏
 * @param {Object} req - 请求对象，params 包含 hotel_id
 * @param {Object} res - 响应对象
 */
async function removeFavorite(req, res) {
  try {
    await favoriteModel.remove(req.user.user_id, req.params.hotel_id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * 获取当前用户的收藏列表
 * @param {Object} req - 请求对象，通过 req.user.user_id 获取当前用户
 * @param {Object} res - 响应对象
 */
async function getFavorites(req, res) {
  try {
    const data = await favoriteModel.findByUser(req.user.user_id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * 检查当前用户是否已收藏指定酒店
 * @param {Object} req - 请求对象，params 包含 hotel_id
 * @param {Object} res - 响应对象
 */
async function checkFavorite(req, res) {
  try {
    const isFav = await favoriteModel.check(req.user.user_id, req.params.hotel_id);
    res.json({ success: true, data: isFav });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { addFavorite, removeFavorite, getFavorites, checkFavorite };
