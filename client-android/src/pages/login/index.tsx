import { View, Text, Input, Button } from '@tarojs/components'
import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { login, register } from '../../services/user'
import { useUserStore } from '../../store/userStore'
import { useThemeStore } from '../../store/themeStore'
import './index.scss'

export default function Login() {
  const { theme } = useThemeStore()
  const d = theme === 'dark'
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
          setTimeout(() => Taro.reLaunch({ url: '/pages/home/index' }), 1500)
        } else {
          // 注册成功后自动登录
          const loginRes = await login({ username, password })
          if (loginRes.success) {
            setToken(loginRes.data.token)
            setUser(loginRes.data.user)
            Taro.showToast({ title: '注册成功', icon: 'success' })
            setTimeout(() => Taro.reLaunch({ url: '/pages/home/index' }), 1500)
          }
        }
      }
    } catch (error: any) {
      const msg = error?.message
      const errorMap: Record<string, string> = {
        username_already_exists: '用户名已被注册',
        username_and_password_required: '请填写用户名和密码',
        registration_failed: '注册失败，请稍后重试',
        invalid_credentials: '用户名或密码错误',
        login_failed: '登录失败，请稍后重试',
        user_not_found: '用户不存在',
      }
      Taro.showToast({ title: errorMap[msg] || '操作失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className={d ? 'login-container-dark' : 'login-container'}>
      <View className='back-home-btn' onClick={() => Taro.reLaunch({ url: '/pages/home/index' })}>
        <Text className={d ? 'back-home-text-dark' : 'back-home-text'}>← 返回首页</Text>
      </View>
      <View className={d ? 'login-box-dark' : 'login-box'}>
        <Text className={d ? 'title-dark' : 'title'}>{isLogin ? '登录' : '注册'}</Text>

        <View className='form'>
          <Input
            className={d ? 'input-dark' : 'input'}
            placeholder='用户名'
            placeholderStyle={d ? 'color: #666' : ''}
            value={username}
            onInput={(e) => setUsername(e.detail.value)}
          />
          <Input
            className={d ? 'input-dark' : 'input'}
            placeholder='密码'
            placeholderStyle={d ? 'color: #666' : ''}
            password
            value={password}
            onInput={(e) => setPassword(e.detail.value)}
          />
          {!isLogin && (
            <>
              <Input
                className={d ? 'input-dark' : 'input'}
                placeholder='邮箱'
                placeholderStyle={d ? 'color: #666' : ''}
                value={email}
                onInput={(e) => setEmail(e.detail.value)}
              />
              <Input
                className={d ? 'input-dark' : 'input'}
                placeholder='手机号（可选）'
                placeholderStyle={d ? 'color: #666' : ''}
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
          <Text className={d ? 'switch-text-dark' : 'switch-text'}>
            {isLogin ? '没有账号？去注册' : '已有账号？去登录'}
          </Text>
        </View>
      </View>
    </View>
  )
}
