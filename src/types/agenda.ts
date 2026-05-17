// 议题项
export interface AgendaItem {
  id: string
  title: string
  description: string
  estimatedMinutes: number
  ownerId: string // 负责人 ID（关联 Participant.id）
  order: number // 排序顺序
  isCompleted: boolean
  createdAt: Date
}
