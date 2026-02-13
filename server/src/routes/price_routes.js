const express = require('express');
const router = express.Router();
const priceController = require('../controllers/price_controller');
const { authenticate, requireMerchant } = require('../middleware/auth_middleware');

router.post('/', authenticate, requireMerchant, priceController.createPriceStrategy);
router.get('/hotel/:hotel_id', priceController.getPriceStrategies);
router.put('/:id', authenticate, requireMerchant, priceController.updatePriceStrategy);
router.delete('/:id', authenticate, requireMerchant, priceController.deletePriceStrategy);
router.get('/calculate', priceController.calculatePrice);

module.exports = router;
