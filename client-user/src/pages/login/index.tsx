import { View, Text, Input, Button } from '@tarojs/components'
import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { login, register } from '../../services/user'
import { useUserStore } from '../../store/userStore'
import './index.scss'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const { setUser, setToken } = useUserStore()

  const handleSubmit = async () => {
    if (!username || !password) {
      Taro.showToast({ title: '请填写用户名和密码', icon: 'none' })
      return
    }

    if (!isLogin && !email) {
      Taro.showToast({ title: '请填写邮箱', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      const res = isLogin
        ? await login({ username, password })
        : await register({ username, password, email, phone })

      if (res.success) {
        if (isLogin) {
          setToken(res.data.token)
          setUser(res.data.user)
          Taro.showToast({ title: '登录成功', icon: 'success' })
          setTimeout(() => Taro.navigateBack(), 1500)
        } else {
          // 注册成功后自动登录
          const loginRes = await login({ username, password })
          if (loginRes.success) {
            setToken(loginRes.data.token)
            setUser(loginRes.data.user)
            Taro.showToast({ title: '注册成功', icon: 'success' })
            setTimeout(() => Taro.navigateBack(), 1500)
          }
        }
      }
    } catch (error) {
      console.error('操作失败:', error)
      Taro.showToast({ title: '操作失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='login-container'>
      <View className='login-box'>
        <Text className='title'>{isLogin ? '登录' : '注册'}</Text>

        <View className='form'>
          <Input
            className='input'
            placeholder='用户名'
            value={username}
            onInput={(e) => setUsername(e.detail.value)}
          />
          <Input
            className='input'
            placeholder='密码'
            password
            value={password}
            onInput={(e) => setPassword(e.detail.value)}
          />
          {!isLogin && (
            <>
              <Input
                className='input'
                placeholder='邮箱'
                value={email}
                onInput={(e) => setEmail(e.detail.value)}
              />
              <Input
                className='input'
                placeholder='手机号（可选）'
                value={phone}
                onInput={(e) => setPhone(e.detail.value)}
              />
            </>
          )}
        </View>

        <Button className='submit-btn' onClick={handleSubmit} loading={loading}>
          {isLogin ? '登录' : '注册'}
        </Button>

        <View className='switch-mode' onClick={() => setIsLogin(!isLogin)}>
          <Text className='switch-text'>
            {isLogin ? '没有账号？去注册' : '已有账号？去登录'}
          </Text>
        </View>
      </View>
    </View>
  )
}
