import { View, Text } from '@tarojs/components'
import React from 'react'
import { useThemeStore } from '../../store/themeStore'
import './index.scss'

export default function ThemeSwitcher() {
  const { theme, fontMode, toggleTheme, toggleFontMode } = useThemeStore()
  return (
    <View className='theme-switcher'>
      <View className={`ts-btn ${theme === 'dark' ? 'active' : ''}`} onClick={toggleTheme}>
        <Text>{theme === 'dark' ? '🌙 深色' : '☀️ 浅色'}</Text>
      </View>
      <View className={`ts-btn ${fontMode === 'elder' ? 'active' : ''}`} onClick={toggleFontMode}>
        <Text>{fontMode === 'elder' ? '大字' : '标准'}</Text>
      </View>
    </View>
  )
}
