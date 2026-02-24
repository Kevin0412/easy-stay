import { create } from 'zustand'
import Taro from '@tarojs/taro'

type Theme = 'light' | 'dark'
type FontMode = 'normal' | 'elder'

interface ThemeState {
  theme: Theme
  fontMode: FontMode
  toggleTheme: () => void
  toggleFontMode: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  fontMode: 'normal',

  toggleTheme: () => {
    const next: Theme = get().theme === 'light' ? 'dark' : 'light'
    set({ theme: next })
    Taro.setStorage({ key: 'theme', data: next })
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', next)
    }
    if (process.env.TARO_ENV === 'weapp') {
      Taro.setTabBarStyle({
        backgroundColor: next === 'dark' ? '#2a2a2a' : '#ffffff',
        color: next === 'dark' ? '#aaa' : '#666',
        selectedColor: '#667eea'
      })
    }
  },

  toggleFontMode: () => {
    const next: FontMode = get().fontMode === 'normal' ? 'elder' : 'normal'
    set({ fontMode: next })
    Taro.setStorage({ key: 'fontMode', data: next })
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-font', next)
    }
  },
}))

// Hydrate from async storage
Taro.getStorage({ key: 'theme' }).then(res => {
  if (res.data) useThemeStore.setState({ theme: res.data as Theme })
}).catch(() => {})
Taro.getStorage({ key: 'fontMode' }).then(res => {
  if (res.data) useThemeStore.setState({ fontMode: res.data as FontMode })
}).catch(() => {})
