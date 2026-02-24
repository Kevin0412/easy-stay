import { View, Text, Button } from '@tarojs/components'
import React, { useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { useUserStore } from '../../store/userStore'
import { parseDate } from '../../utils/date'
import { useThemeStore } from '../../store/themeStore'
import { getUserInfo } from '../../services/user'
import { getFavorites, removeFavorite } from '../../services/favorite'
import { getMyOrders, Order } from '../../services/order'
import './index.scss'

export default function Profile() {
  const { theme } = useThemeStore()
  const d = theme === 'dark'
  const { user, setUser, logout, isLoggedIn } = useUserStore()
  const [favorites, setFavorites] = useState<any[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [tab, setTab] = useState<'orders' | 'favorites'>('orders')

  useDidShow(() => {
    if (isLoggedIn()) {
      loadUserInfo()
      loadFavorites()
      loadOrders()
    }
  })

  const loadUserInfo = async () => {
    try {
      const res = await getUserInfo()
      if (res.success) setUser(res.data)
    } catch (e) {}
  }

  const loadFavorites = async () => {
    try {
      const res = await getFavorites()
      if (res.success) setFavorites(res.data)
    } catch (e) {}
  }

  const loadOrders = async () => {
    try {
      const res = await getMyOrders()
      if (res.success) setOrders(res.data)
    } catch (e) {}
  }

  const handleUnfavorite = async (hotelId: number) => {
    await removeFavorite(hotelId)
    setFavorites(prev => prev.filter(f => f.id !== hotelId))
  }

  const handleLogin = () => Taro.navigateTo({ url: '/pages/login/index' })

  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          logout()
          Taro.showToast({ title: '已退出登录', icon: 'success' })
        }
      }
    })
  }

  if (!isLoggedIn()) {
    return (
      <View className={d ? 'profile-container-dark' : 'profile-container'}>
        <View className={d ? 'back-home-btn-dark' : 'back-home-btn'} onClick={() => Taro.reLaunch({ url: '/pages/home/index' })}>
          <Text className={d ? 'back-home-text-dark' : 'back-home-text'}>← 返回首页</Text>
        </View>
        <View className='not-login'>
          <Text className={d ? 'not-login-text-dark' : 'not-login-text'}>您还未登录</Text>
          <Button className='login-btn' onClick={handleLogin}>去登录</Button>
        </View>
      </View>
    )
  }

  return (
    <View className={d ? 'profile-container-dark' : 'profile-container'}>
      <View className={d ? 'back-home-btn-dark' : 'back-home-btn'} onClick={() => Taro.reLaunch({ url: '/pages/home/index' })}>
        <Text className={d ? 'back-home-text-dark' : 'back-home-text'}>← 返回首页</Text>
      </View>
      <View className='user-info'>
        <View className='avatar'><Text className='avatar-text'>{user?.username?.charAt(0).toUpperCase()}</Text></View>
        <Text className='username'>{user?.username}</Text>
        <Text className='email'>{user?.email}</Text>
      </View>

      <View className={d ? 'tab-bar-dark' : 'tab-bar'}>
        <View className={tab === 'orders' ? 'tab-item-active' : (d ? 'tab-item-dark' : 'tab-item')} onClick={() => setTab('orders')}>
          <Text className={tab === 'orders' ? 'tab-text-active' : (d ? 'tab-text-dark' : 'tab-text-dark')}>我的订单</Text>
        </View>
        <View className={tab === 'favorites' ? 'tab-item-active' : (d ? 'tab-item-dark' : 'tab-item')} onClick={() => setTab('favorites')}>
          <Text className={tab === 'favorites' ? 'tab-text-active' : (d ? 'tab-text-dark' : 'tab-text-dark')}>收藏的酒店</Text>
        </View>
      </View>

      {tab === 'orders' && (
        <View className='order-list'>
          {orders.length === 0 ? (
            <View className='empty-tip'><Text className='empty-text'>暂无订单</Text></View>
          ) : (
            orders.map(order => (
              <View key={order.id} className={d ? 'order-item-dark' : 'order-item'}>
                <Text className={d ? 'order-hotel-dark' : 'order-hotel'}>{order.hotel_name}</Text>
                <Text className={d ? 'order-room-dark' : 'order-room'}>{order.room_type} × {order.room_count || 1}间 | {order.guests || 1}人</Text>
                <Text className={d ? 'order-date-dark' : 'order-date'}>{String(order.check_in).slice(0, 10)} 晚到 {String(order.check_out).slice(0, 10)} 早（{order.nights}晚）</Text>
                <Text className='order-price'>¥{Number(order.total_price).toFixed(2)}</Text>
              </View>
            ))
          )}
        </View>
      )}

      {tab === 'favorites' && (
        <View className='fav-list'>
          {favorites.length === 0 ? (
            <View className='empty-tip'>
              <Text className='empty-text'>暂无收藏</Text>
            </View>
          ) : (
            favorites.map(hotel => (
              <View key={hotel.id} className={d ? 'fav-item-dark' : 'fav-item'} onClick={() => Taro.navigateTo({ url: `/pages/detail/index?id=${hotel.id}` })}>
                <View className='fav-info'>
                  <Text className={d ? 'fav-name-dark' : 'fav-name'}>{hotel.name_cn}</Text>
                  <Text className={d ? 'fav-addr-dark' : 'fav-addr'}>{hotel.address}</Text>
                  <Text className='fav-star'>{'★'.repeat(hotel.star)}</Text>
                </View>
                <View className='fav-remove' onClick={() => { handleUnfavorite(hotel.id) }}>
                  <Text className='fav-remove-text'>取消</Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      <View className={d ? 'logout-bar-dark' : 'logout-bar'}>
        <View className={d ? 'logout-btn-dark' : 'logout-btn'} onClick={handleLogout}><Text className={d ? 'logout-text-dark' : 'logout-btn-text'}>退出登录</Text></View>
      </View>
    </View>
  )
}
