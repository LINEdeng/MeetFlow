/**
 * StatusBadge - 状态标签组件
 */
import { Chip } from '@mui/material'
import { MeetingStatus, ActionItemStatus } from '@/types'

interface StatusBadgeProps {
  status: MeetingStatus | ActionItemStatus
  size?: 'small' | 'medium'
}

// 使用映射对象分开处理避免重复键
const MEETING_STATUS_CONFIG: Record<MeetingStatus, { label: string; color: 'primary' | 'warning' | 'success' | 'default' }> = {
  scheduled: { label: '待开始', color: 'primary' },
  'in-progress': { label: '进行中', color: 'warning' },
  completed: { label: '已结束', color: 'success' },
}

const ACTION_ITEM_STATUS_CONFIG: Record<ActionItemStatus, { label: string; color: 'primary' | 'warning' | 'success' | 'default' }> = {
  todo: { label: '待办', color: 'primary' },
  'in-progress': { label: '进行中', color: 'warning' },
  completed: { label: '已完成', color: 'success' },
}

export default function StatusBadge({ status, size = 'small' }: StatusBadgeProps) {
  const config =
    MEETING_STATUS_CONFIG[status as MeetingStatus] ||
    ACTION_ITEM_STATUS_CONFIG[status as ActionItemStatus]

  if (!config) return null

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      sx={{ fontWeight: 500, borderRadius: '6px' }}
    />
  )
}
