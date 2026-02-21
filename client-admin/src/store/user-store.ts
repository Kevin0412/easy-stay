import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  username: string
  role: 'admin' | 'merchant'
}

interface UserStore {
  token: string | null
  user: User | null
  setUser: (token: string, user: User) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setUser: (token, user) => set({ token, user }),
      clearUser: () => set({ token: null, user: null })
    }),
    {
      name: 'easy-stay-admin-user'
    }
  )
)
