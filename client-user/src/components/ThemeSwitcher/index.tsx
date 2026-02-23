import { View, Text } from '@tarojs/components'
import React from 'react'
import { useThemeStore } from '../../store/themeStore'
import './index.scss'

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useThemeStore()
  return (
    <View className='theme-switcher'>
      <View className={`ts-btn ${theme === 'dark' ? 'active' : ''}`} onClick={toggleTheme}>
        <Text>{theme === 'dark' ? '🌙 深色' : '☀️ 浅色'}</Text>
      </View>
    </View>
  )
}
