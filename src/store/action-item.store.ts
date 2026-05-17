/**
 * ActionItemStore - 行动项状态管理
 */
import { create } from 'zustand'
import { ActionItem, ActionItemStatus, CreateActionItemInput } from '@/types'
import * as actionItemService from '@/services/action-item.service'

interface ActionItemStore {
  actionItems: ActionItem[]
  isLoading: boolean
  error: string | null
  
  // 操作方法
  fetchActionItems: () => Promise<void>
  fetchActionItemsByMeetingId: (meetingId: string) => Promise<ActionItem[]>
  createActionItem: (input: CreateActionItemInput) => Promise<ActionItem>
  updateActionItem: (id: string, updates: Partial<ActionItem>) => Promise<void>
  updateActionItemStatus: (id: string, status: ActionItemStatus) => Promise<void>
  deleteActionItem: (id: string) => Promise<void>
  
  // 辅助方法
  getTodoItems: () => ActionItem[]
  getInProgressItems: () => ActionItem[]
  getCompletedItems: () => ActionItem[]
  getItemsByMeetingId: (meetingId: string) => ActionItem[]
}

export const useActionItemStore = create<ActionItemStore>((set, get) => ({
  actionItems: [],
  isLoading: false,
  error: null,
  
  fetchActionItems: async () => {
    set({ isLoading: true, error: null })
    try {
      const items = await actionItemService.getActionItems()
      set({ actionItems: items, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },
  
  fetchActionItemsByMeetingId: async (meetingId: string) => {
    try {
      return await actionItemService.getActionItemsByMeetingId(meetingId)
    } catch (error) {
      set({ error: (error as Error).message })
      return []
    }
  },
  
  createActionItem: async (input: CreateActionItemInput) => {
    set({ isLoading: true, error: null })
    try {
      const newItem = await actionItemService.createActionItem(input)
      set(state => ({
        actionItems: [...state.actionItems, newItem],
        isLoading: false,
      }))
      return newItem
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },
  
  updateActionItem: async (id: string, updates: Partial<ActionItem>) => {
    set({ isLoading: true, error: null })
    try {
      const updatedItem = await actionItemService.updateActionItem(id, updates)
      set(state => ({
        actionItems: state.actionItems.map(item => (item.id === id ? updatedItem : item)),
        isLoading: false,
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },
  
  updateActionItemStatus: async (id: string, status: ActionItemStatus) => {
    await get().updateActionItem(id, { status })
  },
  
  deleteActionItem: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await actionItemService.deleteActionItem(id)
      set(state => ({
        actionItems: state.actionItems.filter(item => item.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },
  
  getTodoItems: () => {
    return get().actionItems.filter(item => item.status === 'todo')
  },
  
  getInProgressItems: () => {
    return get().actionItems.filter(item => item.status === 'in-progress')
  },
  
  getCompletedItems: () => {
    return get().actionItems.filter(item => item.status === 'completed')
  },
  
  getItemsByMeetingId: (meetingId: string) => {
    return get().actionItems.filter(item => item.meetingId === meetingId)
  },
}))
