import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { User } from '../services/user'

interface UserState {
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
  isLoggedIn: () => boolean
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  token: Taro.getStorageSync('token') || null,

  setUser: (user) => set({ user }),

  setToken: (token) => {
    set({ token })
    if (token) {
      Taro.setStorageSync('token', token)
    } else {
      Taro.removeStorageSync('token')
    }
  },

  logout: () => {
    set({ user: null, token: null })
    Taro.removeStorageSync('token')
  },

  isLoggedIn: () => !!get().token
}))
