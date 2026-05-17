// 统一导出所有类型
// 注意：meeting.ts 内嵌了 ActionItemStatus，action-item.ts 也定义了 ActionItemStatus
// 为避免重复导出，此处显式列出各模块的导出

export type {
  MeetingStatus,
  MeetingTag,
  Participant,
  AgendaItemInMeeting,
  ActionItemStatus,
  ActionItemInMeeting,
  KeyDecisionInMeeting,
  ControversyPointInMeeting,
  TranscriptSegmentInMeeting,
  SpeakingStatInMeeting,
  MeetingMinutesInMeeting,
  Meeting,
  CreateMeetingInput,
} from './meeting'

export type { AgendaItem } from './agenda'

export type {
  ActionItem,
  CreateActionItemInput,
} from './action-item'

export type {
  MeetingMinutes,
  KeyDecision,
  ControversyPoint,
  TranscriptSegment,
  SpeakingStat,
} from './meeting-minutes'

export type { User } from './user'

export * from './common'
