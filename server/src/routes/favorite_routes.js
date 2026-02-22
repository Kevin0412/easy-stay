const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite, getFavorites, checkFavorite } = require('../controllers/favorite_controller');
const { authenticate } = require('../middleware/auth_middleware');

router.get('/', authenticate, getFavorites);
router.post('/', authenticate, addFavorite);
router.delete('/:hotel_id', authenticate, removeFavorite);
router.get('/check/:hotel_id', authenticate, checkFavorite);

module.exports = router;
