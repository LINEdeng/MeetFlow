/**
 * AgendaService - 议题数据操作
 */
import { getMeetingById, updateMeeting } from './meeting.service'
import { AgendaItem } from '@/types'
import { generateId } from '@/utils/id'

/**
 * 为会议添加议题
 */
export async function addAgendaItem(
  meetingId: string,
  item: Omit<AgendaItem, 'id' | 'order' | 'isCompleted' | 'createdAt'>
): Promise<AgendaItem> {
  const meeting = await getMeetingById(meetingId)
  if (!meeting) {
    throw new Error(`Meeting with id ${meetingId} not found`)
  }
  
  const now = new Date()
  const newItem: AgendaItem = {
    ...item,
    id: generateId(),
    order: meeting.agendaItems.length,
    isCompleted: false,
    createdAt: now,
  }
  
  const updatedAgendaItems = [...meeting.agendaItems, newItem]
  await updateMeeting(meetingId, { agendaItems: updatedAgendaItems })
  
  return newItem
}

/**
 * 更新议题
 */
export async function updateAgendaItem(
  meetingId: string,
  itemId: string,
  updates: Partial<AgendaItem>
): Promise<AgendaItem> {
  const meeting = await getMeetingById(meetingId)
  if (!meeting) {
    throw new Error(`Meeting with id ${meetingId} not found`)
  }
  
  const updatedAgendaItems = meeting.agendaItems.map(item => {
    if (item.id === itemId) {
      return { ...item, ...updates }
    }
    return item
  })
  
  await updateMeeting(meetingId, { agendaItems: updatedAgendaItems })
  
  const updatedItem = updatedAgendaItems.find(item => item.id === itemId)
  if (!updatedItem) {
    throw new Error(`AgendaItem with id ${itemId} not found`)
  }
  return updatedItem
}

/**
 * 删除议题
 */
export async function deleteAgendaItem(meetingId: string, itemId: string): Promise<void> {
  const meeting = await getMeetingById(meetingId)
  if (!meeting) {
    throw new Error(`Meeting with id ${meetingId} not found`)
  }
  
  const updatedAgendaItems = meeting.agendaItems
    .filter(item => item.id !== itemId)
    .map((item, index) => ({ ...item, order: index })) // 重新排序
  
  await updateMeeting(meetingId, { agendaItems: updatedAgendaItems })
}

/**
 * 重新排序议题
 */
export async function reorderAgendaItems(
  meetingId: string,
  reorderedItems: AgendaItem[]
): Promise<AgendaItem[]> {
  const meeting = await getMeetingById(meetingId)
  if (!meeting) {
    throw new Error(`Meeting with id ${meetingId} not found`)
  }
  
  const updatedAgendaItems = reorderedItems.map((item, index) => ({
    ...item,
    order: index,
  }))
  
  await updateMeeting(meetingId, { agendaItems: updatedAgendaItems })
  
  return updatedAgendaItems
}
