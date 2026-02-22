const favoriteModel = require('../models/favorite_model');

async function addFavorite(req, res) {
  try {
    const { hotel_id } = req.body;
    await favoriteModel.add(req.user.user_id, hotel_id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function removeFavorite(req, res) {
  try {
    await favoriteModel.remove(req.user.user_id, req.params.hotel_id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getFavorites(req, res) {
  try {
    const data = await favoriteModel.findByUser(req.user.user_id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function checkFavorite(req, res) {
  try {
    const isFav = await favoriteModel.check(req.user.user_id, req.params.hotel_id);
    res.json({ success: true, data: isFav });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { addFavorite, removeFavorite, getFavorites, checkFavorite };
