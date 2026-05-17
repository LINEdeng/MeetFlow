/**
 * ActionItemService - 行动项数据操作
 */
import { storageService } from './storage.service'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { ActionItem, CreateActionItemInput, ActionItemStatus } from '@/types'
import { generateId } from '@/utils/id'
import { getMeetingById } from './meeting.service'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取所有行动项
 */
export async function getActionItems(): Promise<ActionItem[]> {
  await delay(100)
  const items = storageService.getItem<ActionItem[]>(STORAGE_KEYS.ACTION_ITEMS) || []
  return items.map(item => ({
    ...item,
    dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
    completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
  }))
}

/**
 * 获取指定会议的所有行动项
 */
export async function getActionItemsByMeetingId(meetingId: string): Promise<ActionItem[]> {
  const items = await getActionItems()
  return items.filter(item => item.meetingId === meetingId)
}

/**
 * 创建行动项
 */
export async function createActionItem(input: CreateActionItemInput): Promise<ActionItem> {
  await delay(200)
  const items = await getActionItems()
  
  const now = new Date()
  const newItem: ActionItem = {
    ...input,
    id: generateId(),
    completedAt: input.status === 'completed' ? now : undefined,
  }
  
  const updatedItems = [...items, newItem]
  storageService.setItem(STORAGE_KEYS.ACTION_ITEMS, updatedItems)
  
  // 同时更新会议的 actionItems 字段
  const meeting = await getMeetingById(input.meetingId)
  if (meeting) {
    const { updateMeeting } = await import('./meeting.service')
    await updateMeeting(input.meetingId, {
      actionItems: [...meeting.actionItems, newItem],
    })
  }
  
  return newItem
}

/**
 * 更新行动项
 */
export async function updateActionItem(
  id: string,
  updates: Partial<ActionItem>
): Promise<ActionItem> {
  await delay(200)
  const items = await getActionItems()
  const index = items.findIndex(item => item.id === id)
  
  if (index === -1) {
    throw new Error(`ActionItem with id ${id} not found`)
  }
  
  const now = new Date()
  const updatedItem: ActionItem = {
    ...items[index],
    ...updates,
    completedAt: updates.status === 'completed' && !items[index].completedAt
      ? now
      : updates.status !== 'completed'
      ? undefined
      : items[index].completedAt,
  }
  
  items[index] = updatedItem
  storageService.setItem(STORAGE_KEYS.ACTION_ITEMS, items)
  
  return updatedItem
}

/**
 * 更新行动项状态（用于拖拽看板）
 */
export async function updateActionItemStatus(
  id: string,
  status: ActionItemStatus
): Promise<ActionItem> {
  return updateActionItem(id, { status })
}

/**
 * 删除行动项
 */
export async function deleteActionItem(id: string): Promise<void> {
  await delay(200)
  const items = await getActionItems()
  const filteredItems = items.filter(item => item.id !== id)
  storageService.setItem(STORAGE_KEYS.ACTION_ITEMS, filteredItems)
}
