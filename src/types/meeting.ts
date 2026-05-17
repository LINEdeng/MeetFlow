// 会议状态枚举
export type MeetingStatus = 'scheduled' | 'in-progress' | 'completed'

// 会议标签
export type MeetingTag = '项目评审' | '周会' | '客户沟通' | '1v1' | '需求评审' | '头脑风暴' | 'Q2规划'

// 参会人
export interface Participant {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

// 议题项（内嵌定义以避免循环引用）
export interface AgendaItemInMeeting {
  id: string
  title: string
  description: string
  estimatedMinutes: number
  ownerId: string
  order: number
  isCompleted: boolean
  createdAt: Date
}

// 行动项状态
export type ActionItemStatus = 'todo' | 'in-progress' | 'completed'

// 行动项（内嵌定义以避免循环引用）
export interface ActionItemInMeeting {
  id: string
  meetingId: string
  description: string
  ownerId: string
  status: ActionItemStatus
  dueDate?: Date
  completedAt?: Date
  sourceMeetingTitle?: string
  notes?: string
}

// 关键决策
export interface KeyDecisionInMeeting {
  id: string
  content: string
  decidedBy: string
  timestamp: Date
}

// 争议点
export interface ControversyPointInMeeting {
  id: string
  content: string
  relatedParticipants: string[]
  status: 'open' | 'resolved'
}

// 转写片段
export interface TranscriptSegmentInMeeting {
  id: string
  speakerId: string
  speakerName: string
  text: string
  startTime: number
  endTime: number
  confidence: number
}

// 发言统计
export interface SpeakingStatInMeeting {
  speakerId: string
  speakerName: string
  percentage: number
  durationSeconds: number
}

// 会议纪要（内嵌）
export interface MeetingMinutesInMeeting {
  id: string
  meetingId: string
  summary: string
  keyDecisions: KeyDecisionInMeeting[]
  controversies: ControversyPointInMeeting[]
  transcripts: TranscriptSegmentInMeeting[]
  speakingStats: SpeakingStatInMeeting[]
  generatedAt: Date
  isEdited: boolean
}

// 会议
export interface Meeting {
  id: string
  title: string
  startTime: Date
  endTime: Date
  description: string
  participants: Participant[]
  tags: MeetingTag[]
  status: MeetingStatus
  calendarEventId?: string
  agendaItems: AgendaItemInMeeting[]
  minutes?: MeetingMinutesInMeeting
  actionItems: ActionItemInMeeting[]
  createdAt: Date
  updatedAt: Date
}

// 辅助类型：创建会议时的输入（不含 id 和自动生成字段）
export type CreateMeetingInput = Omit<Meeting, 'id' | 'createdAt' | 'updatedAt' | 'actionItems' | 'minutes'>
