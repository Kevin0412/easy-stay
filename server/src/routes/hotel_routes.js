const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel_controller');
const { authenticate, requireAdmin, requireMerchant } = require('../middleware/auth_middleware');

router.post('/', authenticate, requireMerchant, hotelController.createHotel);
// 获取酒店列表不需要认证（用户端浏览酒店）
router.get('/', hotelController.getHotels);
// 获取酒店详情不需要认证（用户端查看详情）
router.get('/:id', hotelController.getHotelById);
router.put('/:id', authenticate, requireMerchant, hotelController.updateHotel);
router.delete('/:id', authenticate, hotelController.deleteHotel);

router.post('/:id/publish', authenticate, requireMerchant, hotelController.publishHotel);
router.post('/:id/approve', authenticate, requireAdmin, hotelController.approveHotel);
router.post('/:id/offline', authenticate, requireAdmin, hotelController.offlineHotel);

module.exports = router;
