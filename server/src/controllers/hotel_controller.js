const hotelModel = require('../models/hotel_model');
const roomModel = require('../models/room_model');

/**
 * 创建酒店
 */
async function createHotel(req, res) {
  try {
    const { name_cn, name_en, address, star, open_date } = req.body;

    if (!name_cn || !address) {
      return res.status(400).json({
        success: false,
        message: 'name_and_address_required'
      });
    }

    const hotel_data = {
      name_cn,
      name_en,
      address,
      star: star || 0,
      open_date,
      created_by: req.user.user_id
    };

    const result = await hotelModel.create(hotel_data);

    res.status(201).json({
      success: true,
      data: { hotel_id: result.insertId },
      message: 'hotel_created_successfully'
    });
  } catch (error) {
    console.error('Create hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'hotel_creation_failed'
    });
  }
}

/**
 * 获取轮播图酒店列表
 */
async function getCarouselHotels(req, res) {
  try {
    // 获取已发布的高星级酒店作为轮播图展示
    const hotels = await hotelModel.findAll({ status: 'published' });

    // 按星级和ID排序，取前5个
    const carousel_hotels = hotels
      .sort((a, b) => {
        if (b.star !== a.star) return b.star - a.star;
        return b.id - a.id;
      })
      .slice(0, 5);

    res.json({
      success: true,
      data: carousel_hotels,
      message: ''
    });
  } catch (error) {
    console.error('Get carousel hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'failed_to_fetch_carousel_hotels'
    });
  }
}

/**
 * 获取酒店列表
 */
async function getHotels(req, res) {
  try {
    const { status, star, keyword } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (star) filters.star = parseInt(star);
    if (keyword) filters.keyword = keyword;

    // 如果有用户认证，商户只能看到自己的酒店
    if (req.user && req.user.role === 'merchant') {
      filters.created_by = req.user.user_id;
    }

    const hotels = await hotelModel.findAll(filters);

    // 为每个酒店附加最低价格
    const hotelsWithPrice = await Promise.all(hotels.map(async (hotel) => {
      const rooms = await roomModel.findByHotelId(hotel.id);
      const min_price = rooms.length > 0 ? Math.min(...rooms.map(r => r.price)) : null;
      return { ...hotel, min_price };
    }));

    res.json({
      success: true,
      data: hotelsWithPrice,
      message: ''
    });
  } catch (error) {
    console.error('Get hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'failed_to_fetch_hotels'
    });
  }
}

/**
 * 获取酒店详情
 */
async function getHotelById(req, res) {
  try {
    const { id } = req.params;
    const hotel = await hotelModel.findById(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'hotel_not_found'
      });
    }

    // 如果有用户认证，商户只能查看自己的酒店
    if (req.user && req.user.role === 'merchant' && hotel.created_by !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'access_denied'
      });
    }

    res.json({
      success: true,
      data: hotel,
      message: ''
    });
  } catch (error) {
    console.error('Get hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'failed_to_fetch_hotel'
    });
  }
}

/**
 * 更新酒店信息
 */
async function updateHotel(req, res) {
  try {
    const { id } = req.params;
    const hotel = await hotelModel.findById(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'hotel_not_found'
      });
    }

    // 商户只能更新自己的酒店
    if (req.user.role === 'merchant' && hotel.created_by !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'access_denied'
      });
    }

    const { name_cn, name_en, address, star, open_date } = req.body;
    const hotel_data = { name_cn, name_en, address, star, open_date };

    await hotelModel.update(id, hotel_data);

    res.json({
      success: true,
      data: {},
      message: 'hotel_updated_successfully'
    });
  } catch (error) {
    console.error('Update hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'hotel_update_failed'
    });
  }
}

/**
 * 发布酒店（提交审核）
 */
async function publishHotel(req, res) {
  try {
    const { id } = req.params;
    const hotel = await hotelModel.findById(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'hotel_not_found'
      });
    }

    if (hotel.created_by !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'access_denied'
      });
    }

    await hotelModel.updateStatus(id, 'pending');

    res.json({
      success: true,
      data: {},
      message: 'hotel_submitted_for_review'
    });
  } catch (error) {
    console.error('Publish hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'publish_failed'
    });
  }
}

/**
 * 审核酒店（管理员）
 */
async function approveHotel(req, res) {
  try {
    const { id } = req.params;
    const hotel = await hotelModel.findById(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'hotel_not_found'
      });
    }

    await hotelModel.updateStatus(id, 'published');

    res.json({
      success: true,
      data: {},
      message: 'hotel_approved'
    });
  } catch (error) {
    console.error('Approve hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'approval_failed'
    });
  }
}

/**
 * 下线酒店（管理员）
 */
async function offlineHotel(req, res) {
  try {
    const { id } = req.params;
    const hotel = await hotelModel.findById(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'hotel_not_found'
      });
    }

    await hotelModel.updateStatus(id, 'offline');

    res.json({
      success: true,
      data: {},
      message: 'hotel_taken_offline'
    });
  } catch (error) {
    console.error('Offline hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'offline_failed'
    });
  }
}

/**
 * 删除酒店
 */
async function deleteHotel(req, res) {
  try {
    const { id } = req.params;
    const hotel = await hotelModel.findById(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'hotel_not_found'
      });
    }

    // 商户只能删除自己的酒店
    if (req.user.role === 'merchant' && hotel.created_by !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'access_denied'
      });
    }

    await hotelModel.deleteById(id);

    res.json({
      success: true,
      data: {},
      message: 'hotel_deleted_successfully'
    });
  } catch (error) {
    console.error('Delete hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'deletion_failed'
    });
  }
}

module.exports = {
  createHotel,
  getCarouselHotels,
  getHotels,
  getHotelById,
  updateHotel,
  publishHotel,
  approveHotel,
  offlineHotel,
  deleteHotel
};
