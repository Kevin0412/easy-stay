import { View, Text, Picker } from '@tarojs/components'
import React, { useState } from 'react'
import Taro, { useLoad } from '@tarojs/taro'
import { getHotelById, Hotel } from '../../services/hotel'
import { getRoomsByHotelId, calculatePrice, Room } from '../../services/room'
import './index.scss'

export default function Detail() {
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [totalPrice, setTotalPrice] = useState<number | null>(null)

  // 加载酒店详情和房型列表
  const loadHotelDetail = async (hotelId: number) => {
    setLoading(true)
    try {
      // 获取酒店详情
      const hotelRes = await getHotelById(hotelId)
      if (hotelRes.success) {
        setHotel(hotelRes.data)
      }

      // 获取房型列表
      const roomsRes = await getRoomsByHotelId(hotelId)
      if (roomsRes.success) {
        setRooms(roomsRes.data)
      }
    } catch (error) {
      console.error('加载酒店详情失败:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  // 计算价格
  const handleCalculatePrice = async () => {
    if (!selectedRoom || !startDate || !endDate) {
      Taro.showToast({
        title: '请选择房型和日期',
        icon: 'none'
      })
      return
    }

    if (startDate >= endDate) {
      Taro.showToast({
        title: '结束日期必须晚于开始日期',
        icon: 'none'
      })
      return
    }

    try {
      const res = await calculatePrice({
        room_id: selectedRoom.id,
        start_date: startDate,
        end_date: endDate
      })
      if (res.success) {
        setTotalPrice(res.data.total_price)
      }
    } catch (error) {
      console.error('计算价格失败:', error)
      Taro.showToast({
        title: '计算价格失败',
        icon: 'none'
      })
    }
  }

  // 页面加载时获取酒店ID
  useLoad(() => {
    const instance = Taro.getCurrentInstance()
    const params = instance.router?.params || {}
    const hotelId = params.id ? Number(params.id) : null

    if (hotelId) {
      loadHotelDetail(hotelId)
    } else {
      Taro.showToast({
        title: '酒店ID不存在',
        icon: 'none'
      })
    }
  })

  // 渲染星级
  const renderStars = () => {
    if (!hotel) return ''
    return '★'.repeat(hotel.star) + '☆'.repeat(5 - hotel.star)
  }

  // 返回列表页
  const handleBack = () => {
    Taro.navigateBack({
      delta: 1
    }).catch(() => {
      // 如果返回失败，跳转到列表页
      Taro.redirectTo({
        url: '/pages/list/index'
      })
    })
  }

  if (loading) {
    return (
      <View className='detail-container'>
        <Text className='loading-text'>加载中...</Text>
      </View>
    )
  }

  if (!hotel) {
    return (
      <View className='detail-container'>
        <Text className='error-text'>酒店信息不存在</Text>
      </View>
    )
  }

  return (
    <View className='detail-container'>
      {/* 返回按钮 */}
      <View className='back-btn' onClick={handleBack}>
        <Text className='back-text'>← 返回</Text>
      </View>

      {/* 酒店信息 */}
      <View className='hotel-info'>
        <Text className='hotel-name'>{hotel.name_cn}</Text>
        <Text className='hotel-name-en'>{hotel.name_en}</Text>
        <View className='hotel-stars'>{renderStars()}</View>
        <Text className='hotel-address'>地址：{hotel.address}</Text>
        <Text className='hotel-open-date'>开业时间：{hotel.open_date}</Text>
      </View>

      {/* 房型列表 */}
      <View className='room-section'>
        <Text className='section-title'>房型列表</Text>
        {rooms.length === 0 ? (
          <Text className='empty-text'>暂无房型信息</Text>
        ) : (
          <View className='room-list'>
            {rooms.map(room => (
              <View
                key={room.id}
                className={`room-item ${selectedRoom?.id === room.id ? 'selected' : ''}`}
                onClick={() => setSelectedRoom(room)}
              >
                <View className='room-type'>{room.room_type}</View>
                <View className='room-info'>
                  <Text className='room-price'>¥{room.price}/晚</Text>
                  <Text className='room-stock'>剩余：{room.stock}间</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 日期选择 */}
      <View className='date-section'>
        <Text className='section-title'>选择日期</Text>
        <View className='date-picker-group'>
          <View className='date-picker-item'>
            <Text className='date-label'>入住日期：</Text>
            <Picker
              mode='date'
              value={startDate}
              onChange={(e) => setStartDate(e.detail.value)}
            >
              <View className='date-value'>
                {startDate || '请选择'}
              </View>
            </Picker>
          </View>
          <View className='date-picker-item'>
            <Text className='date-label'>离店日期：</Text>
            <Picker
              mode='date'
              value={endDate}
              onChange={(e) => setEndDate(e.detail.value)}
            >
              <View className='date-value'>
                {endDate || '请选择'}
              </View>
            </Picker>
          </View>
        </View>
      </View>

      {/* 价格计算 */}
      <View className='price-section'>
        <View className='calculate-btn' onClick={handleCalculatePrice}>
          <Text className='calculate-btn-text'>计算总价</Text>
        </View>
        {totalPrice !== null && (
          <View className='total-price'>
            <Text className='price-label'>总价：</Text>
            <Text className='price-value'>¥{totalPrice.toFixed(2)}</Text>
          </View>
        )}
      </View>
    </View>
  )
}
