/**
 * AgendaEditor - 议题编辑器（主组件，支持拖拽排序）
 */
import { useState } from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import AddIcon from '@mui/icons-material/Add'
import { AgendaItem, Participant } from '@/types'
import { formatDuration } from '@/utils/date'
import AgendaItemCard from './AgendaItemCard'
import AgendaItemForm from './AgendaItemForm'

interface AgendaEditorProps {
  agendaItems: AgendaItem[]
  participants: Participant[]
  onAdd: (item: Omit<AgendaItem, 'id' | 'order' | 'isCompleted' | 'createdAt'>) => void
  onUpdate: (itemId: string, updates: Partial<AgendaItem>) => void
  onDelete: (itemId: string) => void
  onReorder: (reorderedItems: AgendaItem[]) => void
  meetingId?: string
}

export default function AgendaEditor({
  agendaItems,
  participants,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
}: AgendaEditorProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<AgendaItem | undefined>(undefined)

  // 总预估时长
  const totalDuration = agendaItems.reduce((sum, item) => sum + item.estimatedMinutes, 0)

  // 处理拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = agendaItems.findIndex(item => item.id === active.id)
    const newIndex = agendaItems.findIndex(item => item.id === over.id)

    const newItems = [...agendaItems]
    const [movedItem] = newItems.splice(oldIndex, 1)
    newItems.splice(newIndex, 0, movedItem)

    onReorder(newItems)
  }

  // 获取参会人名称
  const getParticipantName = (ownerId: string) => {
    const participant = participants.find(p => p.id === ownerId)
    return participant?.name || '未分配'
  }

  // 处理编辑
  const handleEdit = (item: AgendaItem) => {
    setEditingItem(item)
    setFormOpen(true)
  }

  // 处理保存
  const handleSave = (itemData: Omit<AgendaItem, 'id' | 'order' | 'isCompleted' | 'createdAt'>) => {
    if (editingItem) {
      onUpdate(editingItem.id, itemData)
    } else {
      onAdd(itemData)
    }
    setFormOpen(false)
    setEditingItem(undefined)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          议题列表 ({agendaItems.length} 项)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          总预估时长: {formatDuration(totalDuration)}
        </Typography>
      </Box>

      {agendaItems.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
            border: '2px dashed #e0e0e0',
          }}
          elevation={0}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            暂无议题，点击添加
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingItem(undefined)
              setFormOpen(true)
            }}
          >
            添加议题
          </Button>
        </Paper>
      ) : (
        <>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={agendaItems.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <Box>
                {agendaItems.map(item => (
                  <AgendaItemCard
                    key={item.id}
                    item={item}
                    participantName={getParticipantName(item.ownerId)}
                    onEdit={handleEdit}
                    onDelete={onDelete}
                  />
                ))}
              </Box>
            </SortableContext>
          </DndContext>

          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingItem(undefined)
              setFormOpen(true)
            }}
            sx={{ mt: 2 }}
          >
            添加议题
          </Button>
        </>
      )}

      {/* 议题编辑表单 */}
      <AgendaItemForm
        open={formOpen}
        agendaItem={editingItem}
        participants={participants}
        onSave={handleSave}
        onCancel={() => {
          setFormOpen(false)
          setEditingItem(undefined)
        }}
      />
    </Box>
  )
}
