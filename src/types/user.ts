// 用户通知偏好
export interface NotificationPreference {
  beforeMeeting: boolean // 会前提醒
  reminderMinutesBefore: number // 提前多少分钟提醒
  emailNotifications: boolean // 邮件通知
}

// 用户
export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  calendarIds: string[] // 关联的日历 ID
  notificationPrefs: NotificationPreference
}
