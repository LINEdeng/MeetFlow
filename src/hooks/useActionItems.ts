/**
 * useActionItems - 行动项管理 Hook
 */
import { useEffect, useCallback } from 'react'
import { ActionItem, ActionItemStatus, CreateActionItemInput } from '@/types'
import { useActionItemStore } from '@/store'
import toast from 'react-hot-toast'

export function useActionItems(meetingId?: string) {
  const {
    actionItems,
    isLoading,
    error,
    fetchActionItems,
    createActionItem,
    updateActionItem,
    updateActionItemStatus,
    deleteActionItem,
    getTodoItems,
    getInProgressItems,
    getCompletedItems,
    getItemsByMeetingId,
  } = useActionItemStore()
  
  // 初始化时获取行动项列表
  useEffect(() => {
    fetchActionItems()
  }, [fetchActionItems])
  
  // 根据 meetingId 过滤行动项
  const filteredItems = useCallback(() => {
    if (meetingId) {
      return getItemsByMeetingId(meetingId)
    }
    return actionItems
  }, [actionItems, meetingId, getItemsByMeetingId])
  
  // 创建行动项
  const handleCreateActionItem = useCallback(
    async (input: CreateActionItemInput) => {
      try {
        const newItem = await createActionItem(input)
        toast.success('行动项创建成功')
        return newItem
      } catch (error) {
        toast.error('创建行动项失败')
        throw error
      }
    },
    [createActionItem]
  )
  
  // 更新行动项
  const handleUpdateActionItem = useCallback(
    async (id: string, updates: Partial<ActionItem>) => {
      try {
        await updateActionItem(id, updates)
        toast.success('行动项更新成功')
      } catch (error) {
        toast.error('更新行动项失败')
        throw error
      }
    },
    [updateActionItem]
  )
  
  // 更新行动项状态（用于拖拽看板）
  const handleUpdateStatus = useCallback(
    async (id: string, status: ActionItemStatus) => {
      try {
        await updateActionItemStatus(id, status)
      } catch (error) {
        toast.error('状态更新失败')
        throw error
      }
    },
    [updateActionItemStatus]
  )
  
  // 删除行动项
  const handleDeleteActionItem = useCallback(
    async (id: string) => {
      try {
        await deleteActionItem(id)
        toast.success('行动项删除成功')
      } catch (error) {
        toast.error('删除行动项失败')
        throw error
      }
    },
    [deleteActionItem]
  )
  
  return {
    actionItems: filteredItems(),
    todoItems: getTodoItems(),
    inProgressItems: getInProgressItems(),
    completedItems: getCompletedItems(),
    isLoading,
    error,
    
    createActionItem: handleCreateActionItem,
    updateActionItem: handleUpdateActionItem,
    updateActionItemStatus: handleUpdateStatus,
    deleteActionItem: handleDeleteActionItem,
    refetch: fetchActionItems,
  }
}
