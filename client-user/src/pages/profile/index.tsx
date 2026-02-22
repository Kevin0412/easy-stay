import { View, Text, Button } from '@tarojs/components'
import React, { useState } from 'react'
import Taro, { useLoad } from '@tarojs/taro'
import { useUserStore } from '../../store/userStore'
import { getUserInfo } from '../../services/user'
import { getFavorites, removeFavorite } from '../../services/favorite'
import { getMyOrders, Order } from '../../services/order'
import './index.scss'

export default function Profile() {
  const { user, setUser, logout, isLoggedIn } = useUserStore()
  const [favorites, setFavorites] = useState<any[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [tab, setTab] = useState<'orders' | 'favorites'>('orders')

  useLoad(() => {
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
      <View className='profile-container'>
        <View className='not-login'>
          <Text className='not-login-text'>您还未登录</Text>
          <Button className='login-btn' onClick={handleLogin}>去登录</Button>
        </View>
      </View>
    )
  }

  return (
    <View className='profile-container'>
      <View className='back-home-btn' onClick={() => Taro.navigateBack()}>
        <Text className='back-home-text'>← 返回首页</Text>
      </View>
      <View className='user-info'>
        <View className='avatar'>{user?.username?.charAt(0).toUpperCase()}</View>
        <Text className='username'>{user?.username}</Text>
        <Text className='email'>{user?.email}</Text>
      </View>

      <View className='tab-bar'>
        <View className={`tab-item ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
          <Text>我的订单</Text>
        </View>
        <View className={`tab-item ${tab === 'favorites' ? 'active' : ''}`} onClick={() => setTab('favorites')}>
          <Text>收藏的酒店</Text>
        </View>
      </View>

      {tab === 'orders' && (
        <View className='order-list'>
          {orders.length === 0 ? (
            <View className='empty-tip'><Text className='empty-text'>暂无订单</Text></View>
          ) : (
            orders.map(order => (
              <View key={order.id} className='order-item'>
                <Text className='order-hotel'>{order.hotel_name}</Text>
                <Text className='order-room'>{order.room_type}</Text>
                <Text className='order-date'>{order.check_in} ~ {order.check_out}（{order.nights}晚）</Text>
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
              <View key={hotel.id} className='fav-item' onClick={() => Taro.navigateTo({ url: `/pages/detail/index?id=${hotel.id}` })}>
                <View className='fav-info'>
                  <Text className='fav-name'>{hotel.name_cn}</Text>
                  <Text className='fav-addr'>{hotel.address}</Text>
                  <Text className='fav-star'>{'★'.repeat(hotel.star)}</Text>
                </View>
                <View className='fav-remove' onClick={(e) => { e.stopPropagation(); handleUnfavorite(hotel.id) }}>
                  <Text className='fav-remove-text'>取消</Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      <Button className='logout-btn' onClick={handleLogout}>退出登录</Button>
    </View>
  )
}
