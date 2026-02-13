const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel_controller');
const { authenticate, requireAdmin, requireMerchant } = require('../middleware/auth_middleware');

router.post('/', authenticate, requireMerchant, hotelController.createHotel);
router.get('/', authenticate, hotelController.getHotels);
router.get('/:id', authenticate, hotelController.getHotelById);
router.put('/:id', authenticate, requireMerchant, hotelController.updateHotel);
router.delete('/:id', authenticate, hotelController.deleteHotel);

router.post('/:id/publish', authenticate, requireMerchant, hotelController.publishHotel);
router.post('/:id/approve', authenticate, requireAdmin, hotelController.approveHotel);
router.post('/:id/offline', authenticate, requireAdmin, hotelController.offlineHotel);

module.exports = router;
