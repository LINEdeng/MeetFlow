// API 响应（为未来对接后端预留）
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
