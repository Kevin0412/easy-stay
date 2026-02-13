const roomModel = require('../models/room_model');
const hotelModel = require('../models/hotel_model');

/**
 * 创建房型
 */
async function createRoom(req, res) {
  try {
    const { hotel_id, room_type, price, stock } = req.body;

    if (!hotel_id || !room_type || !price) {
      return res.status(400).json({
        success: false,
        message: 'hotel_id_room_type_and_price_required'
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

    const room_data = { hotel_id, room_type, price, stock: stock || 0 };
    const result = await roomModel.create(room_data);

    res.status(201).json({
      success: true,
      data: { room_id: result.insertId },
      message: 'room_created_successfully'
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({
      success: false,
      message: 'room_creation_failed'
    });
  }
}

/**
 * 获取酒店的所有房型
 */
async function getRoomsByHotelId(req, res) {
  try {
    const { hotel_id } = req.params;
    const rooms = await roomModel.findByHotelId(hotel_id);

    res.json({
      success: true,
      data: rooms,
      message: ''
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'failed_to_fetch_rooms'
    });
  }
}

/**
 * 更新房型信息
 */
async function updateRoom(req, res) {
  try {
    const { id } = req.params;
    const room = await roomModel.findById(id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'room_not_found'
      });
    }

    const hotel = await hotelModel.findById(room.hotel_id);
    if (req.user.role === 'merchant' && hotel.created_by !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'access_denied'
      });
    }

    const { room_type, price, stock } = req.body;
    const room_data = { room_type, price, stock };

    await roomModel.update(id, room_data);

    res.json({
      success: true,
      data: {},
      message: 'room_updated_successfully'
    });
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({
      success: false,
      message: 'room_update_failed'
    });
  }
}

/**
 * 删除房型
 */
async function deleteRoom(req, res) {
  try {
    const { id } = req.params;
    const room = await roomModel.findById(id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'room_not_found'
      });
    }

    const hotel = await hotelModel.findById(room.hotel_id);
    if (req.user.role === 'merchant' && hotel.created_by !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'access_denied'
      });
    }

    await roomModel.deleteById(id);

    res.json({
      success: true,
      data: {},
      message: 'room_deleted_successfully'
    });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({
      success: false,
      message: 'deletion_failed'
    });
  }
}

module.exports = {
  createRoom,
  getRoomsByHotelId,
  updateRoom,
  deleteRoom
};
