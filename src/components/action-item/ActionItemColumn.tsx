/**
 * ActionItemColumn - 看板列（待办/进行中/已完成）
 */
import { Box, Typography, Paper, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useDroppable } from '@dnd-kit/core'
import { ActionItem } from '@/types'
import ActionItemCard from './ActionItemCard'

interface ActionItemColumnProps {
  id: string
  title: string
  color: string
  items: ActionItem[]
  participantMap: Record<string, string>
  onStatusChange?: (id: string, status: ActionItem['status']) => void
  onUpdate?: (id: string, updates: Partial<ActionItem>) => void
  onDelete?: (id: string) => void
  onCreateClick?: () => void
}

export default function ActionItemColumn({
  id,
  title,
  color,
  items,
  participantMap,
  onStatusChange,
  onUpdate,
  onDelete,
  onCreateClick,
}: ActionItemColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        flex: 1,
        minWidth: 300,
        maxWidth: 400,
        p: 2,
        backgroundColor: isOver ? `${color}15` : '#f9f9f9',
        borderTop: '3px solid',
        borderTopColor: color,
        height: 'calc(100vh - 250px)',
        overflow: 'auto',
        transition: 'background-color 0.2s',
      }}
      elevation={0}
    >
      {/* 列标题 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color }}>
          {title}
          <Typography component="span" sx={{ ml: 1, color: 'text.disabled' }}>
            {items.length}
          </Typography>
        </Typography>

        {onCreateClick && (
          <Button size="small" startIcon={<AddIcon />} onClick={onCreateClick}>
            新建
          </Button>
        )}
      </Box>

      {/* 行动项卡片列表 */}
      {items.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 4,
            border: '2px dashed #e0e0e0',
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="text.disabled">
            拖拽任务到此处
          </Typography>
        </Box>
      ) : (
        items.map(item => (
          <ActionItemCard
            key={item.id}
            item={item}
            participantName={participantMap[item.ownerId]}
            onStatusChange={onStatusChange}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))
      )}
    </Paper>
  )
}
