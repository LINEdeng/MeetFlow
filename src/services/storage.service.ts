// StorageService - localStorage 封装
export const storageService = {
  /**
   * 获取存储的数据（带前缀）
   */
  getItem<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : null
    } catch (error) {
      console.error(`StorageService.getItem error for key "${key}":`, error)
      return null
    }
  },

  /**
   * 存储数据（带前缀）
   */
  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`StorageService.setItem error for key "${key}":`, error)
      throw error
    }
  },

  /**
   * 移除数据
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`StorageService.removeItem error for key "${key}":`, error)
    }
  },

  /**
   * 清空所有 MeetFlow 相关的数据
   */
  clearAll(): void {
    try {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('meetflow_')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.error('StorageService.clearAll error:', error)
    }
  },
}
