/**
 * ActionItemCard - 行动项卡片（可拖拽）
 */
import { useState } from 'react'
import { Paper, Typography, Box, Chip, IconButton, Collapse, TextField, Button } from '@mui/material'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import EditIcon from '@mui/icons-material/Edit'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { ActionItem, ActionItemStatus } from '@/types'
import { formatDate } from '@/utils/date'

interface ActionItemCardProps {
  item: ActionItem
  participantName?: string
  onStatusChange?: (id: string, status: ActionItemStatus) => void
  onUpdate?: (id: string, updates: Partial<ActionItem>) => void
  onDelete?: (id: string) => void
}

export default function ActionItemCard({
  item,
  participantName,
  onStatusChange,
  onUpdate,
}: ActionItemCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [editingNotes, setEditingNotes] = useState(false)
  const [notes, setNotes] = useState(item.notes || '')

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isOverdue =
    item.dueDate && new Date(item.dueDate) < new Date() && item.status !== 'completed'

  const handleComplete = () => {
    if (onStatusChange) {
      onStatusChange(item.id, 'completed')
    }
  }

  const handleSaveNotes = () => {
    if (onUpdate) {
      onUpdate(item.id, { notes })
    }
    setEditingNotes(false)
  }

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      sx={{
        p: 2,
        mb: 1.5,
        cursor: 'grab',
        borderLeft: '3px solid',
        borderLeftColor:
          item.status === 'completed'
            ? 'success.main'
            : item.status === 'in-progress'
            ? 'warning.main'
            : 'primary.main',
        '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
      }}
      elevation={0}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        {/* 拖拽手柄 */}
        <IconButton
          size="small"
          sx={{ cursor: 'grab', color: 'text.disabled', mt: -0.5 }}
          {...attributes}
          {...listeners}
        >
          <DragIndicatorIcon fontSize="small" />
        </IconButton>

        {/* 勾选按钮 */}
        {item.status !== 'completed' && (
          <IconButton size="small" onClick={handleComplete} color="success">
            <CheckCircleOutlineIcon fontSize="small" />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              textDecoration: item.status === 'completed' ? 'line-through' : 'none',
              color: item.status === 'completed' ? 'text.disabled' : 'inherit',
            }}
          >
            {item.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5, flexWrap: 'wrap' }}>
            {participantName && (
              <Chip label={participantName} size="small" sx={{ height: 20, fontSize: '11px' }} />
            )}

            {item.dueDate && (
              <Chip
                label={`截止: ${formatDate(item.dueDate)}`}
                size="small"
                color={isOverdue ? 'error' : 'default'}
                sx={{ height: 20, fontSize: '11px' }}
              />
            )}

            {item.sourceMeetingTitle && (
              <Chip
                label={item.sourceMeetingTitle}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: '11px' }}
              />
            )}
          </Box>

          {/* 展开/收起按钮 */}
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <IconButton size="small" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>

            {onUpdate && (
              <IconButton size="small" onClick={() => setEditingNotes(!editingNotes)}>
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          {/* 展开的备注区域 */}
          <Collapse in={expanded || editingNotes}>
            <Box sx={{ mt: 1 }}>
              {editingNotes ? (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    multiline
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="添加备注..."
                  />
                  <Button size="small" onClick={handleSaveNotes}>
                    保存
                  </Button>
                </Box>
              ) : (
                item.notes && (
                  <Typography variant="caption" color="text.secondary">
                    {item.notes}
                  </Typography>
                )
              )}
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Paper>
  )
}
