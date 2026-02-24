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
  token: null,

  setUser: (user) => set({ user }),

  setToken: (token) => {
    set({ token })
    if (token) {
      Taro.setStorage({ key: 'token', data: token })
    } else {
      Taro.removeStorage({ key: 'token' })
    }
  },

  logout: () => {
    set({ user: null, token: null })
    Taro.removeStorage({ key: 'token' })
  },

  isLoggedIn: () => !!get().token
}))

// Hydrate token from async storage
Taro.getStorage({ key: 'token' }).then(res => {
  if (res.data) useUserStore.setState({ token: res.data as string })
}).catch(() => {})
