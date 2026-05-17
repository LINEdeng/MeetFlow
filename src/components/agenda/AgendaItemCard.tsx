/**
 * AgendaItemCard - 单个议题卡片（可拖拽）
 */
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
} from '@mui/material'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { AgendaItem } from '@/types'
import { formatDuration } from '@/utils/date'

interface AgendaItemCardProps {
  item: AgendaItem
  participantName?: string
  onEdit?: (item: AgendaItem) => void
  onDelete?: (itemId: string) => void
}

export default function AgendaItemCard({
  item,
  participantName,
  onEdit,
  onDelete,
}: AgendaItemCardProps) {
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

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 1.5,
        borderLeft: '4px solid',
        borderLeftColor: item.isCompleted ? 'success.main' : 'primary.main',
        '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          {/* 拖拽手柄 */}
          <IconButton
            size="small"
            sx={{ cursor: 'grab', color: 'text.disabled' }}
            {...attributes}
            {...listeners}
          >
            <DragIndicatorIcon fontSize="small" />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  textDecoration: item.isCompleted ? 'line-through' : 'none',
                  color: item.isCompleted ? 'text.disabled' : 'inherit',
                }}
              >
                {item.title}
              </Typography>
              {item.isCompleted && (
                <Chip label="已完成" size="small" color="success" sx={{ height: 20 }} />
              )}
            </Box>

            {item.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {item.description}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {participantName && (
                <Typography variant="caption" color="text.secondary">
                  负责人: {participantName}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                预估: {formatDuration(item.estimatedMinutes)}
              </Typography>
            </Box>
          </Box>

          {/* 操作按钮 */}
          <Box>
            {onEdit && (
              <IconButton size="small" onClick={() => onEdit(item)}>
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton size="small" color="error" onClick={() => onDelete(item.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
