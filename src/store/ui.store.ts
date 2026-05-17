/**
 * UIStore - UI 状态管理（侧边栏、主题等）
 */
import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  language: 'zh' | 'en'
  
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (lang: 'zh' | 'en') => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  theme: 'light',
  language: 'zh',
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setTheme: (theme: 'light' | 'dark') => set({ theme }),
  setLanguage: (lang: 'zh' | 'en') => set({ language: lang }),
}))
