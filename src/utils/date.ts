import { format, isToday, isTomorrow, isThisWeek } from 'date-fns'
import { zhCN } from 'date-fns/locale'

/**
 * 格式化日期为 YYYY/MM/DD
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'yyyy/MM/dd')
}

/**
 * 格式化时间为 HH:mm
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'HH:mm')
}

/**
 * 格式化日期时间
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'yyyy/MM/dd HH:mm')
}

/**
 * 获取相对时间描述（如"3 小时前"、"明天"）
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (isToday(d)) {
    return `今天 ${format(d, 'HH:mm')}`
  }
  if (isTomorrow(d)) {
    return `明天 ${format(d, 'HH:mm')}`
  }
  if (isThisWeek(d)) {
    return format(d, 'EEEE HH:mm', { locale: zhCN })
  }
  return format(d, 'MM/dd HH:mm')
}

/**
 * 计算两个日期之间的分钟数
 */
export function getDurationMinutes(start: Date | string, end: Date | string): number {
  const startDate = typeof start === 'string' ? new Date(start) : start
  const endDate = typeof end === 'string' ? new Date(end) : end
  return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))
}

/**
 * 格式化持续时间为可读字符串
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}小时${mins > 0 ? ` ${mins}分钟` : ''}`
  }
  return `${mins}分钟`
}
