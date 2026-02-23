import { View, Text } from '@tarojs/components'
import React, { useState } from 'react'
import Taro, { useLoad } from '@tarojs/taro'
import { createOrder } from '../../services/order'
import { useUserStore } from '../../store/userStore'
import { useThemeStore } from '../../store/themeStore'
import './index.scss'

export default function Order() {
  const { theme } = useThemeStore()
  const [params, setParams] = useState<any>({})
  const [submitting, setSubmitting] = useState(false)
  const { isLoggedIn } = useUserStore()

  useLoad(() => {
    const instance = Taro.getCurrentInstance()
    const p = instance.router?.params || {}
    setParams(p)
  })

  const nights = params.checkIn && params.checkOut
    ? Math.round((new Date(params.checkOut).getTime() - new Date(params.checkIn).getTime()) / 86400000)
    : 0

  const rooms: { id: number; type: string; count: number }[] = params.rooms
    ? JSON.parse(decodeURIComponent(params.rooms))
    : []

  const handleConfirm = async () => {
    if (!isLoggedIn()) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    setSubmitting(true)
    try {
      const totalRooms = rooms.reduce((s, r) => s + r.count, 0)
      for (const room of rooms) {
        const roomPrice = Number(params.totalPrice) * room.count / totalRooms
        const res = await createOrder({
          hotel_id: Number(params.hotelId),
          room_id: room.id,
          check_in: params.checkIn,
          check_out: params.checkOut,
          nights,
          total_price: parseFloat(roomPrice.toFixed(2)),
          guests: room.count,
          room_count: room.count
        })
        if (!res.success) {
          if (res.message === 'room_out_of_stock') {
            Taro.showToast({ title: `${room.type} 已售罄`, icon: 'none' })
          } else if (res.message === 'guests_exceed_capacity') {
            Taro.showToast({ title: '入住人数超过房型容纳上限', icon: 'none' })
          } else {
            Taro.showToast({ title: '预订失败', icon: 'none' })
          }
          return
        }
      }
      Taro.showToast({ title: '预订成功', icon: 'success' })
      setTimeout(() => Taro.navigateTo({ url: '/pages/profile/index' }), 1500)
    } catch (e) {
      Taro.showToast({ title: '预订失败', icon: 'none' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View className={`order-container theme-${theme}`}>
      <View className='order-header'>
        <View className='back-btn' onClick={() => Taro.navigateBack()}>
          <Text className='back-text'>← 返回</Text>
        </View>
        <Text className='order-title'>确认预订</Text>
      </View>

      <View className='order-card'>
        <View className='order-row'>
          <Text className='order-label'>酒店</Text>
          <Text className='order-value'>{decodeURIComponent(params.hotelName || '')}</Text>
        </View>
        {rooms.map(room => (
          <View className='order-row' key={room.id}>
            <Text className='order-label'>{room.type}</Text>
            <Text className='order-value'>{room.count} 间</Text>
          </View>
        ))}
        <View className='order-row'>
          <Text className='order-label'>入住人数</Text>
          <Text className='order-value'>{params.guests} 人</Text>
        </View>
        <View className='order-row'>
          <Text className='order-label'>入住</Text>
          <Text className='order-value'>{params.checkIn}</Text>
        </View>
        <View className='order-row'>
          <Text className='order-label'>离店</Text>
          <Text className='order-value'>{params.checkOut}</Text>
        </View>
        <View className='order-row'>
          <Text className='order-label'>间夜</Text>
          <Text className='order-value'>{nights} 晚</Text>
        </View>
        <View className='order-row total'>
          <Text className='order-label'>总价</Text>
          <Text className='order-price'>¥{Number(params.totalPrice || 0).toFixed(2)}</Text>
        </View>
      </View>

      <View className={`confirm-btn ${submitting ? 'disabled' : ''}`} onClick={submitting ? undefined : handleConfirm}>
        <Text className='confirm-btn-text'>{submitting ? '提交中...' : '确认预订'}</Text>
      </View>
    </View>
  )
}
