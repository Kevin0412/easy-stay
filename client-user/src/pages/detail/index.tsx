import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import React, { useState } from 'react'
import Taro, { useLoad } from '@tarojs/taro'
import { getHotelById, Hotel } from '../../services/hotel'
import { getRoomsByHotelId, Room, calculatePrice } from '../../services/room'
import { checkFavorite, addFavorite, removeFavorite } from '../../services/favorite'
import { useUserStore } from '../../store/userStore'
import { useThemeStore } from '../../store/themeStore'
import Calendar from '../../components/Calendar'
import './index.scss'

export default function Detail() {
  const { theme } = useThemeStore()
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedRooms, setSelectedRooms] = useState<Set<number>>(new Set())
  const [totalPrice, setTotalPrice] = useState<number | null>(null)
  const [originalPrice, setOriginalPrice] = useState<number | null>(null)
  const [discount, setDiscount] = useState<number | null>(null)
  const [strategyName, setStrategyName] = useState<string | null>(null)
  const [isFav, setIsFav] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [guests, setGuests] = useState(1)
  const [roomCounts, setRoomCounts] = useState<Record<number, number>>({})
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

  // 计算所有已选房型的总人数上限
  const calcMaxGuests = (counts: Record<number, number>) =>
    rooms.reduce((sum, room) => sum + (counts[room.id] || 0) * (room.max_guests || 2), 0)

  // 计算总房间数
  const calcTotalRooms = (counts: Record<number, number>) =>
    Object.values(counts).reduce((sum, c) => sum + c, 0)

  // 计算价格（调用后端接口，支持价格策略折扣）
  const handleCalculatePrice = async () => {
    if (selectedRooms.size === 0 || !startDate || !endDate) {
      Taro.showToast({ title: '请选择房型和日期', icon: 'none' })
      return
    }
    if (startDate >= endDate) {
      Taro.showToast({ title: '结束日期必须晚于开始日期', icon: 'none' })
      return
    }
    const totalRooms = calcTotalRooms(roomCounts)
    if (totalRooms === 0) {
      Taro.showToast({ title: '请选择房间数量', icon: 'none' })
      return
    }
    if (guests < totalRooms) {
      Taro.showToast({ title: '入住人数不能少于房间数', icon: 'none' })
      return
    }
    if (guests > calcMaxGuests(roomCounts)) {
      Taro.showToast({ title: '人数超过所选房型总容纳人数', icon: 'none' })
      return
    }
    try {
      let sumTotal = 0
      let sumOriginal = 0
      let bestDiscount: number | null = null
      let bestStrategyName: string | null = null

      for (const roomId of selectedRooms) {
        const count = roomCounts[roomId] || 1
        const res = await calculatePrice({ room_id: roomId, start_date: startDate, end_date: endDate })
        const { total_price, original_price, discount, strategy_name } = res.data
        sumTotal += total_price * count
        sumOriginal += original_price * count
        if (discount < 1 && (bestDiscount === null || discount < bestDiscount)) {
          bestDiscount = discount
          bestStrategyName = strategy_name
        }
      }

      setTotalPrice(parseFloat(sumTotal.toFixed(2)))
      setOriginalPrice(parseFloat(sumOriginal.toFixed(2)))
      setDiscount(bestDiscount)
      setStrategyName(bestStrategyName)
    } catch {
      Taro.showToast({ title: '价格计算失败，请重试', icon: 'none' })
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
    if (selectedRooms.size === 0 || !startDate || !endDate || totalPrice === null) {
      Taro.showToast({ title: '请先计算总价', icon: 'none' })
      return
    }
    const nights = Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)
    const roomData = Array.from(selectedRooms).map(id => {
      const room = rooms.find(r => r.id === id)
      return { id, type: room?.room_type || '', count: roomCounts[id] || 1 }
    })
    Taro.navigateTo({
      url: `/pages/order/index?hotelId=${hotel!.id}&hotelName=${encodeURIComponent(hotel!.name_cn)}&rooms=${encodeURIComponent(JSON.stringify(roomData))}&checkIn=${startDate}&checkOut=${endDate}&nights=${nights}&totalPrice=${totalPrice}&guests=${guests}`
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
    <View className={`detail-container theme-${theme}`}>
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
        {hotel.tags && (
          <View className='hotel-tags'>
            <Text className='tags-title'>设施服务：</Text>
            <View className='tags-list'>
              {hotel.tags.split(',').map((tag, i) => (
                <Text key={i} className='tag-item'>{tag.trim()}</Text>
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
        <View className='guest-selector'>
          <View className='guest-item'>
            <Text className='guest-label'>入住人数</Text>
            <View className='guest-control'>
              <View className='guest-btn' onClick={() => setGuests(Math.max(1, guests - 1))}><Text>-</Text></View>
              <Text className='guest-value'>{guests}人</Text>
              <View className='guest-btn' onClick={() => {
                const newGuests = guests + 1
                if (newGuests > calcMaxGuests(roomCounts)) {
                  Taro.showToast({ title: '人数超过所选房型总容纳人数', icon: 'none' })
                } else {
                  setGuests(newGuests)
                }
              }}><Text>+</Text></View>
            </View>
          </View>
        </View>
        {rooms.length === 0 ? (
          <Text className='empty-text'>暂无房型信息</Text>
        ) : (
          <View className='room-list'>
            {rooms.map(room => (
              <View
                key={room.id}
                className={`room-item ${selectedRooms.has(room.id) ? 'selected' : ''}`}
                onClick={() => {
                  const newSelected = new Set(selectedRooms)
                  if (newSelected.has(room.id)) {
                    newSelected.delete(room.id)
                  } else {
                    newSelected.add(room.id)
                  }
                  setSelectedRooms(newSelected)
                }}
              >
                {room.image && <Image className='room-image' src={room.image} mode='aspectFill' />}
                <View className='room-type'>{room.room_type}</View>
                <View className='room-info'>
                  <Text className='room-price'>¥{room.price}/晚</Text>
                  <Text className='room-stock'>剩余：{room.stock}间</Text>
                </View>
                <View className='room-count-control'>
                  <Text className='room-count-label'>房间数量（最多{room.max_guests}人/间）</Text>
                  <View className='guest-control'>
                    <View className='guest-btn' onClick={(e) => {
                      e.stopPropagation()
                      const current = roomCounts[room.id] || 0
                      const newCount = Math.max(0, current - 1)
                      const newCounts = { ...roomCounts, [room.id]: newCount }
                      const newTotalRooms = calcTotalRooms(newCounts)
                      if (guests > calcMaxGuests(newCounts)) {
                        Taro.showToast({ title: '请先减少入住人数', icon: 'none' })
                      } else if (newTotalRooms > 0 && guests < newTotalRooms) {
                        Taro.showToast({ title: '入住人数不能少于房间数', icon: 'none' })
                      } else {
                        setRoomCounts(newCounts)
                      }
                    }}><Text>-</Text></View>
                    <Text className='guest-value'>{roomCounts[room.id] || 0}间</Text>
                    <View className='guest-btn' onClick={(e) => {
                      e.stopPropagation()
                      const current = roomCounts[room.id] || 0
                      setRoomCounts({ ...roomCounts, [room.id]: current + 1 })
                    }}><Text>+</Text></View>
                  </View>
                </View>
              </View>
            ))}
          </View>
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

      {/* 日历选择器 */}
      {showCalendar && (
        <Calendar
          startDate={startDate}
          endDate={endDate}
          onClose={() => setShowCalendar(false)}
          onChange={(start, end) => {
            setStartDate(start)
            setEndDate(end)
            if (start && end) setShowCalendar(false)
          }}
        />
      )}
    </View>
  )
}
