import { View, Text, Button } from '@tarojs/components'
import React, { useEffect } from 'react'
import Taro, { useLoad } from '@tarojs/taro'
import { useUserStore } from '../../store/userStore'
import { getUserInfo } from '../../services/user'
import './index.scss'

export default function Profile() {
  const { user, token, setUser, logout, isLoggedIn } = useUserStore()

  useLoad(() => {
    if (isLoggedIn()) {
      loadUserInfo()
    }
  })

  const loadUserInfo = async () => {
    try {
      const res = await getUserInfo()
      if (res.success) {
        setUser(res.data)
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  const handleLogin = () => {
    Taro.navigateTo({ url: '/pages/login/index' })
  }

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
          <Button className='login-btn' onClick={handleLogin}>
            去登录
          </Button>
        </View>
      </View>
    )
  }

  return (
    <View className='profile-container'>
      <View className='user-info'>
        <View className='avatar'>{user?.username?.charAt(0).toUpperCase()}</View>
        <Text className='username'>{user?.username}</Text>
        <Text className='email'>{user?.email}</Text>
      </View>

      <View className='menu-list'>
        <View className='menu-item'>
          <Text className='menu-text'>我的订单</Text>
        </View>
        <View className='menu-item'>
          <Text className='menu-text'>收藏的酒店</Text>
        </View>
      </View>

      <Button className='logout-btn' onClick={handleLogout}>
        退出登录
      </Button>
    </View>
  )
}
