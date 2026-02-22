const priceModel = require('../models/price_model');
const hotelModel = require('../models/hotel_model');

/**
 * 创建价格策略
 */
async function createPriceStrategy(req, res) {
  try {
    const { hotel_id, room_id, strategy_name, discount, start_date, end_date } = req.body;

    if (!hotel_id || !strategy_name || !discount || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'required_fields_missing'
      });
    }

    const hotel = await hotelModel.findById(hotel_id);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'hotel_not_found'
      });
    }

    if (req.user.role === 'merchant' && hotel.created_by !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'access_denied'
      });
    }

    const price_data = { hotel_id, room_id, strategy_name, discount, start_date, end_date };
    const result = await priceModel.create(price_data);

    res.status(201).json({
      success: true,
      data: { strategy_id: result.insertId },
      message: 'price_strategy_created_successfully'
    });
  } catch (error) {
    console.error('Create price strategy error:', error);
    res.status(500).json({
      success: false,
      message: 'price_strategy_creation_failed'
    });
  }
}

/**
 * 获取酒店的价格策略
 */
async function getPriceStrategies(req, res) {
  try {
    const { hotel_id } = req.params;
    const strategies = await priceModel.findByHotelId(hotel_id);

    res.json({
      success: true,
      data: strategies,
      message: ''
    });
  } catch (error) {
    console.error('Get price strategies error:', error);
    res.status(500).json({
      success: false,
      message: 'failed_to_fetch_price_strategies'
    });
  }
}

/**
 * 更新价格策略
 */
async function updatePriceStrategy(req, res) {
  try {
    const { id } = req.params;
    const strategy = await priceModel.findById(id);

    if (!strategy) {
      return res.status(404).json({
        success: false,
        message: 'price_strategy_not_found'
      });
    }

    const hotel = await hotelModel.findById(strategy.hotel_id);
    if (req.user.role === 'merchant' && hotel.created_by !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'access_denied'
      });
    }

    const { strategy_name, discount, start_date, end_date } = req.body;
    const price_data = { strategy_name, discount, start_date, end_date };

    await priceModel.update(id, price_data);

    res.json({
      success: true,
      data: {},
      message: 'price_strategy_updated_successfully'
    });
  } catch (error) {
    console.error('Update price strategy error:', error);
    res.status(500).json({
      success: false,
      message: 'price_strategy_update_failed'
    });
  }
}

/**
 * 删除价格策略
 */
async function deletePriceStrategy(req, res) {
  try {
    const { id } = req.params;
    const strategy = await priceModel.findById(id);

    if (!strategy) {
      return res.status(404).json({
        success: false,
        message: 'price_strategy_not_found'
      });
    }

    const hotel = await hotelModel.findById(strategy.hotel_id);
    if (req.user.role === 'merchant' && hotel.created_by !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'access_denied'
      });
    }

    await priceModel.deleteById(id);

    res.json({
      success: true,
      data: {},
      message: 'price_strategy_deleted_successfully'
    });
  } catch (error) {
    console.error('Delete price strategy error:', error);
    res.status(500).json({
      success: false,
      message: 'deletion_failed'
    });
  }
}

/**
 * 计算价格
 */
async function calculatePrice(req, res) {
  try {
    const { room_id, start_date, end_date } = req.query;

    if (!room_id || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'room_id_and_dates_required'
      });
    }

    const result = await priceModel.calculatePrice(room_id, start_date, end_date);

    res.json({
      success: true,
      data: result,
      message: ''
    });
  } catch (error) {
    console.error('Calculate price error:', error);
    res.status(500).json({
      success: false,
      message: 'price_calculation_failed'
    });
  }
}

module.exports = {
  createPriceStrategy,
  getPriceStrategies,
  updatePriceStrategy,
  deletePriceStrategy,
  calculatePrice
};
