import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import React, { useState } from 'react'
import Taro, { useLoad } from '@tarojs/taro'
import { getHotelById, Hotel } from '../../services/hotel'
import { getRoomsByHotelId, calculatePrice, Room } from '../../services/room'
import { checkFavorite, addFavorite, removeFavorite } from '../../services/favorite'
import { useUserStore } from '../../store/userStore'
import Calendar from '../../components/Calendar'
import './index.scss'

export default function Detail() {
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [totalPrice, setTotalPrice] = useState<number | null>(null)
  const [originalPrice, setOriginalPrice] = useState<number | null>(null)
  const [discount, setDiscount] = useState<number | null>(null)
  const [strategyName, setStrategyName] = useState<string | null>(null)
  const [isFav, setIsFav] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const { isLoggedIn } = useUserStore()

  // 加载酒店详情和房型列表
  const loadHotelDetail = async (hotelId: number) => {
    setLoading(true)
    try {
      const hotelRes = await getHotelById(hotelId)
      if (hotelRes.success) setHotel(hotelRes.data)

      const roomsRes = await getRoomsByHotelId(hotelId)
      if (roomsRes.success) setRooms(roomsRes.data.sort((a, b) => a.price - b.price))

      if (isLoggedIn()) {
        const favRes = await checkFavorite(hotelId)
        if (favRes.success) setIsFav(favRes.data)
      }
    } catch (error) {
      Taro.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFav = async () => {
    if (!isLoggedIn()) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    if (!hotel) return
    if (isFav) {
      await removeFavorite(hotel.id)
      setIsFav(false)
    } else {
      await addFavorite(hotel.id)
      setIsFav(true)
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
        setOriginalPrice(res.data.original_price)
        setDiscount(res.data.discount)
        setStrategyName(res.data.strategy_name)
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

  // 立即预订
  const handleBook = () => {
    if (!isLoggedIn()) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    if (!selectedRoom || !startDate || !endDate || totalPrice === null) {
      Taro.showToast({ title: '请先计算总价', icon: 'none' })
      return
    }
    const nights = Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)
    Taro.navigateTo({
      url: `/pages/order/index?hotelId=${hotel!.id}&hotelName=${encodeURIComponent(hotel!.name_cn)}&roomId=${selectedRoom.id}&roomType=${encodeURIComponent(selectedRoom.room_type)}&checkIn=${startDate}&checkOut=${endDate}&nights=${nights}&totalPrice=${totalPrice}`
    })
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
      {/* 顶部导航头：酒店名称 + 返回 + 收藏 */}
      <View className='top-bar'>
        <View className='back-btn' onClick={handleBack}>
          <Text className='back-text'>← 返回</Text>
        </View>
        <Text className='top-bar-title' numberOfLines={1}>{hotel.name_cn}</Text>
        <View className='fav-btn' onClick={handleToggleFav}>
          <Text className={`fav-icon ${isFav ? 'active' : ''}`}>{isFav ? '♥' : '♡'}</Text>
        </View>
      </View>

      {/* 酒店图片轮播 */}
      {hotel.images && (
        <View className='hotel-images'>
          <Swiper
            className='images-swiper'
            indicatorColor='rgba(255, 255, 255, 0.5)'
            indicatorActiveColor='#fff'
            circular
            autoplay
            interval={4000}
            indicatorDots
          >
            {(() => {
              try {
                const imageList = JSON.parse(hotel.images)
                return imageList.map((img: string, index: number) => (
                  <SwiperItem key={index}>
                    <Image
                      className='hotel-image'
                      src={img}
                      mode='aspectFill'
                    />
                  </SwiperItem>
                ))
              } catch (e) {
                return (
                  <SwiperItem>
                    <Image
                      className='hotel-image'
                      src={hotel.cover_image || 'https://via.placeholder.com/800x400?text=Hotel'}
                      mode='aspectFill'
                    />
                  </SwiperItem>
                )
              }
            })()}
          </Swiper>
        </View>
      )}

      {/* 酒店信息 */}
      <View className='hotel-info'>
        <Text className='hotel-name'>{hotel.name_cn}</Text>
        <Text className='hotel-name-en'>{hotel.name_en}</Text>
        <View className='hotel-stars'>{renderStars()}</View>
        <Text className='hotel-address'>地址：{hotel.address}</Text>
        <Text className='hotel-open-date'>开业时间：{hotel.open_date ? String(hotel.open_date).slice(0, 10) : ''}</Text>
        {hotel.nearby && (
          <View className='hotel-nearby'>
            <Text className='nearby-title'>附近景点：</Text>
            {hotel.nearby.split(',').map((item, i) => (
              <Text key={i} className='nearby-item'>{item}</Text>
            ))}
          </View>
        )}
        {hotel.facilities && (
          <View className='hotel-facilities'>
            <Text className='facilities-title'>设施服务：</Text>
            <View className='facilities-list'>
              {hotel.facilities.split(',').map((item, i) => (
                <Text key={i} className='facility-item'>{item}</Text>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* 日历+入住间夜Banner */}
      <View className='date-banner' onClick={() => setShowCalendar(true)}>
        <View className='date-item'>
          <Text className='date-label'>入住</Text>
          <Text className='date-value'>{startDate || '选择日期'}</Text>
        </View>
        <View className='date-divider'>
          {startDate && endDate && startDate < endDate ? (
            <Text className='date-nights'>{Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)}晚</Text>
          ) : (
            <Text className='date-arrow'>→</Text>
          )}
        </View>
        <View className='date-item'>
          <Text className='date-label'>离店</Text>
          <Text className='date-value'>{endDate || '选择日期'}</Text>
        </View>
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
                {room.image && <Image className='room-image' src={room.image} mode='aspectFill' />}
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

      {/* 日期选择 + 间夜 */}
      <View className='date-section'>
        <Text className='section-title'>选择日期</Text>
        <View className='date-picker-group' onClick={() => setShowCalendar(true)}>
          <View className='date-picker-item'>
            <Text className='date-label'>入住：</Text>
            <View className='date-value'>{startDate || '请选择'}</View>
          </View>
          <View className='date-picker-item'>
            <Text className='date-label'>离店：</Text>
            <View className='date-value'>{endDate || '请选择'}</View>
          </View>
        </View>
        {startDate && endDate && startDate < endDate && (
          <View className='nights-banner'>
            <Text className='nights-text'>共 {Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)} 晚</Text>
          </View>
        )}
        {showCalendar && (
          <Calendar
            startDate={startDate}
            endDate={endDate}
            onChange={(s, e) => { setStartDate(s); setEndDate(e); setTotalPrice(null); setOriginalPrice(null); setDiscount(null); setStrategyName(null) }}
            onClose={() => setShowCalendar(false)}
          />
        )}
      </View>

      {/* 价格计算 + 预订 */}
      <View className='price-section'>
        <View className='calculate-btn' onClick={handleCalculatePrice}>
          <Text className='calculate-btn-text'>计算总价</Text>
        </View>
        {totalPrice !== null && (
          <View className='price-breakdown'>
            {discount !== null && discount < 1 && (
              <View className='price-row'>
                <Text className='price-label'>原价：</Text>
                <Text className='price-original'>¥{originalPrice!.toFixed(2)}</Text>
              </View>
            )}
            {strategyName && discount !== null && discount < 1 && (
              <View className='price-row'>
                <Text className='price-label'>优惠：</Text>
                <Text className='price-discount-tag'>{strategyName} {Math.round(discount * 10)}折</Text>
              </View>
            )}
            <View className='price-row'>
              <Text className='price-label'>{discount !== null && discount < 1 ? '优惠价：' : '总价：'}</Text>
              <Text className='price-value'>¥{totalPrice.toFixed(2)}</Text>
            </View>
          </View>
        )}
        {totalPrice !== null && (
          <View className='book-btn' onClick={handleBook}>
            <Text className='book-btn-text'>立即预订</Text>
          </View>
        )}
      </View>
    </View>
  )
}
