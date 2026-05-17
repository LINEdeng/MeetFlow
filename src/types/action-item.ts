// 行动项状态枚举
export type ActionItemStatus = 'todo' | 'in-progress' | 'completed'

// 行动项
export interface ActionItem {
  id: string
  meetingId: string // 来源会议 ID
  description: string
  ownerId: string // 负责人 ID
  status: ActionItemStatus
  dueDate?: Date
  completedAt?: Date
  sourceMeetingTitle?: string // 来源会议标题（用于显示）
  notes?: string // 备注
}

// 辅助类型：创建行动项时的输入
export type CreateActionItemInput = Omit<ActionItem, 'id' | 'completedAt'>
