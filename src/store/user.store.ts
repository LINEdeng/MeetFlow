/**
 * UserStore - 用户状态管理（模拟）
 */
import { create } from 'zustand'
import { User } from '@/types'
import { MOCK_USERS } from '@/constants/mock-data'

interface UserStore {
  currentUser: User | null
  isAuthenticated: boolean
  
  // 操作方法
  login: (userId: string) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser: MOCK_USERS[0], // 默认模拟登录用户"张三"
  isAuthenticated: true,
  
  login: (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId)
    if (user) {
      set({ currentUser: user, isAuthenticated: true })
    }
  },
  
  logout: () => {
    set({ currentUser: null, isAuthenticated: false })
  },
  
  updateUser: (updates: Partial<User>) => {
    set(state => ({
      currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
    }))
  },
}))
