/**
 * MeetingFilters - 筛选器组件（状态、标签、日期）
 */
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  SelectChangeEvent,
} from '@mui/material'
import { MeetingStatus, MeetingTag } from '@/types'

interface MeetingFiltersProps {
  statusFilter: MeetingStatus | 'all'
  tagFilter: MeetingTag | 'all'
  onStatusChange: (status: MeetingStatus | 'all') => void
  onTagChange: (tag: MeetingTag | 'all') => void
}

const STATUS_OPTIONS: { value: MeetingStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部状态' },
  { value: 'scheduled', label: '待开始' },
  { value: 'in-progress', label: '进行中' },
  { value: 'completed', label: '已结束' },
]

const TAG_OPTIONS: { value: MeetingTag | 'all'; label: string }[] = [
  { value: 'all', label: '全部标签' },
  { value: '项目评审', label: '项目评审' },
  { value: '周会', label: '周会' },
  { value: '客户沟通', label: '客户沟通' },
  { value: '1v1', label: '1v1' },
  { value: '需求评审', label: '需求评审' },
  { value: '头脑风暴', label: '头脑风暴' },
]

export default function MeetingFilters({
  statusFilter,
  tagFilter,
  onStatusChange,
  onTagChange,
}: MeetingFiltersProps) {
  const handleStatusChange = (event: SelectChangeEvent) => {
    onStatusChange(event.target.value as MeetingStatus | 'all')
  }
  
  const handleTagChange = (event: SelectChangeEvent) => {
    onTagChange(event.target.value as MeetingTag | 'all')
  }
  
  const hasActiveFilters = statusFilter !== 'all' || tagFilter !== 'all'
  
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>状态</InputLabel>
        <Select value={statusFilter} label="状态" onChange={handleStatusChange}>
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>标签</InputLabel>
        <Select value={tagFilter} label="标签" onChange={handleTagChange}>
          {TAG_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {hasActiveFilters && (
        <Chip
          label="清除筛选"
          size="small"
          onDelete={() => {
            onStatusChange('all')
            onTagChange('all')
          }}
          sx={{ cursor: 'pointer' }}
        />
      )}
    </Box>
  )
}
