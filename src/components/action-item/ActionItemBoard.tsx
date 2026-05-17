/**
 * ActionItemBoard - 行动项看板容器（三列）
 */
import React, { useCallback, useEffect } from 'react'
import { Box, CircularProgress } from '@mui/material'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core'
import { ActionItem, ActionItemStatus } from '@/types'
import { useActionItemStore } from '@/store'
import ActionItemColumn from './ActionItemColumn'
import ActionItemCard from './ActionItemCard'

interface ActionItemBoardProps {
  meetingId?: string
}

export default function ActionItemBoard({ meetingId }: ActionItemBoardProps) {
  const { actionItems, isLoading, updateActionItemStatus, updateActionItem, fetchActionItems } =
    useActionItemStore()
  const [activeItem, setActiveItem] = React.useState<ActionItem | null>(null)

  // 配置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  // 初始化时获取数据
  useEffect(() => {
    fetchActionItems()
  }, [fetchActionItems])

  // 过滤行动项（按会议ID）
  const filteredItems = meetingId
    ? actionItems.filter(item => item.meetingId === meetingId)
    : actionItems

  // 参会人映射（根据 ownerId 获取名称）
  const participantMap = React.useMemo(() => {
    const map: Record<string, string> = {
      user1: '张三',
      user2: '李四',
      user3: '王五',
      user4: '赵六',
    }
    return map
  }, [])

  // 按状态分组
  const todoItems = filteredItems.filter(item => item.status === 'todo')
  const inProgressItems = filteredItems.filter(item => item.status === 'in-progress')
  const completedItems = filteredItems.filter(item => item.status === 'completed')

  // 处理拖拽开始
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const item = actionItems.find(i => i.id === event.active.id)
      setActiveItem(item || null)
    },
    [actionItems]
  )

  // 处理拖拽结束
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      setActiveItem(null)

      if (!over) return

      const itemId = active.id as string
      const newStatus = over.id as ActionItemStatus

      // 只有拖到列容器上才触发状态更新
      if (['todo', 'in-progress', 'completed'].includes(newStatus)) {
        const item = actionItems.find(i => i.id === itemId)
        if (item && item.status !== newStatus) {
          try {
            await updateActionItemStatus(itemId, newStatus)
          } catch (error) {
            console.error('更新状态失败:', error)
          }
        }
      }
    },
    [actionItems, updateActionItemStatus]
  )

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2 }}>
        <ActionItemColumn
          id="todo"
          title="待办"
          color="#635bff"
          items={todoItems}
          participantMap={participantMap}
          onStatusChange={updateActionItemStatus}
          onUpdate={updateActionItem}
        />

        <ActionItemColumn
          id="in-progress"
          title="进行中"
          color="#f59e0b"
          items={inProgressItems}
          participantMap={participantMap}
          onStatusChange={updateActionItemStatus}
          onUpdate={updateActionItem}
        />

        <ActionItemColumn
          id="completed"
          title="已完成"
          color="#10b981"
          items={completedItems}
          participantMap={participantMap}
          onStatusChange={updateActionItemStatus}
          onUpdate={updateActionItem}
        />
      </Box>

      <DragOverlay>
        {activeItem ? (
          <ActionItemCard
            item={activeItem}
            participantName={participantMap[activeItem.ownerId]}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
