// 关键决策
export interface KeyDecision {
  id: string
  content: string
  decidedBy: string // 决策人 ID
  timestamp: Date
}

// 争议点
export interface ControversyPoint {
  id: string
  content: string
  relatedParticipants: string[] // 相关参会人 ID 列表
  status: 'open' | 'resolved' // 状态：未解决/已解决
}

// 转写片段
export interface TranscriptSegment {
  id: string
  speakerId: string
  speakerName: string
  text: string
  startTime: number // 秒
  endTime: number // 秒
  confidence: number // 置信度 0-1
}

// 发言统计
export interface SpeakingStat {
  speakerId: string
  speakerName: string
  percentage: number // 发言占比
  durationSeconds: number // 发言时长（秒）
}

// 会议纪要
export interface MeetingMinutes {
  id: string
  meetingId: string
  summary: string // 摘要
  keyDecisions: KeyDecision[]
  controversies: ControversyPoint[]
  transcripts: TranscriptSegment[]
  speakingStats: SpeakingStat[]
  generatedAt: Date
  isEdited: boolean // 是否被人工编辑过
}
