const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room_controller');
const { authenticate, requireMerchant } = require('../middleware/auth_middleware');

router.post('/', authenticate, requireMerchant, roomController.createRoom);
router.get('/hotel/:hotel_id', roomController.getRoomsByHotelId);
router.put('/:id', authenticate, requireMerchant, roomController.updateRoom);
router.delete('/:id', authenticate, requireMerchant, roomController.deleteRoom);

module.exports = router;
