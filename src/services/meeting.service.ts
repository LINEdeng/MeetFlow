/**
 * MeetingService - 会议数据操作
 */
import { storageService } from './storage.service'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { Meeting, CreateMeetingInput, ActionItem } from '@/types'
import { generateId } from '@/utils/id'

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 反序列化 Date 对象
function deserializeMeeting(meeting: Meeting): Meeting {
  return {
    ...meeting,
    startTime: new Date(meeting.startTime),
    endTime: new Date(meeting.endTime),
    createdAt: new Date(meeting.createdAt),
    updatedAt: new Date(meeting.updatedAt),
    agendaItems: meeting.agendaItems.map(item => ({
      ...item,
      createdAt: new Date(item.createdAt),
    })),
    actionItems: meeting.actionItems.map(item => ({
      ...item,
      dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
      completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
    })),
    minutes: meeting.minutes
      ? {
          ...meeting.minutes,
          generatedAt: new Date(meeting.minutes.generatedAt),
          keyDecisions: meeting.minutes.keyDecisions.map(d => ({
            ...d,
            timestamp: new Date(d.timestamp),
          })),
        }
      : undefined,
  }
}

/**
 * 获取所有会议
 */
export async function getMeetings(): Promise<Meeting[]> {
  await delay(100)
  const meetings = storageService.getItem<Meeting[]>(STORAGE_KEYS.MEETINGS) || []
  return meetings.map(deserializeMeeting)
}

/**
 * 根据 ID 获取单个会议
 */
export async function getMeetingById(id: string): Promise<Meeting | undefined> {
  const meetings = await getMeetings()
  return meetings.find(m => m.id === id)
}

/**
 * 创建新会议
 */
export async function createMeeting(input: CreateMeetingInput): Promise<Meeting> {
  await delay(200)
  const meetings = await getMeetings()
  
  const now = new Date()
  const newMeeting: Meeting = {
    ...input,
    id: generateId(),
    startTime: new Date(input.startTime),
    endTime: new Date(input.endTime),
    agendaItems: input.agendaItems || [],
    actionItems: [],
    createdAt: now,
    updatedAt: now,
  }
  
  const updatedMeetings = [...meetings, newMeeting]
  storageService.setItem(STORAGE_KEYS.MEETINGS, updatedMeetings)
  
  return newMeeting
}

/**
 * 更新会议
 */
export async function updateMeeting(id: string, updates: Partial<Meeting>): Promise<Meeting> {
  await delay(200)
  const meetings = await getMeetings()
  const index = meetings.findIndex(m => m.id === id)
  
  if (index === -1) {
    throw new Error(`Meeting with id ${id} not found`)
  }
  
  const updatedMeeting: Meeting = {
    ...meetings[index],
    ...updates,
    updatedAt: new Date(),
  }
  
  meetings[index] = updatedMeeting
  storageService.setItem(STORAGE_KEYS.MEETINGS, meetings)
  
  return updatedMeeting
}

/**
 * 删除会议
 */
export async function deleteMeeting(id: string): Promise<void> {
  await delay(200)
  const meetings = await getMeetings()
  const filteredMeetings = meetings.filter(m => m.id !== id)
  storageService.setItem(STORAGE_KEYS.MEETINGS, filteredMeetings)
  
  // 同时删除关联的行动项
  const actionItems = storageService.getItem<ActionItem[]>(STORAGE_KEYS.ACTION_ITEMS) || []
  const filteredActionItems = actionItems.filter(item => item.meetingId !== id)
  storageService.setItem(STORAGE_KEYS.ACTION_ITEMS, filteredActionItems)
}

/**
 * 保存会议纪要
 */
export async function saveMeetingMinutes(
  meetingId: string,
  minutes: Meeting['minutes']
): Promise<Meeting> {
  return updateMeeting(meetingId, { minutes })
}

/**
 * 搜索会议（按标题、描述、标签）
 */
export async function searchMeetings(query: string): Promise<Meeting[]> {
  const meetings = await getMeetings()
  const lowerQuery = query.toLowerCase()
  
  return meetings.filter(
    m =>
      m.title.toLowerCase().includes(lowerQuery) ||
      m.description.toLowerCase().includes(lowerQuery) ||
      m.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}
