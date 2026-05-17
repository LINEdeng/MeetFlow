/**
 * MeetingForm - 创建/编辑会议表单组件
 */
import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import { MobileDatePicker, TimePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { zhCN } from 'date-fns/locale'
import { Meeting, MeetingTag, CreateMeetingInput, Participant } from '@/types'
import { MOCK_USERS } from '@/constants/mock-data'
import { createMeeting } from '@/services/meeting.service'

interface MeetingFormProps {
  meeting?: Meeting // 编辑时传入
  onSave?: (meeting: Meeting) => void
  onCancel?: () => void
  /** 模板预填充 - 标题 */
  defaultTitle?: string
  /** 模板预填充 - 描述 */
  defaultDescription?: string
  /** 模板预填充 - 标签 */
  defaultTags?: MeetingTag[]
}

// 可选标签列表
const AVAILABLE_TAGS: MeetingTag[] = [
  '项目评审',
  '周会',
  '客户沟通',
  '1v1',
  '需求评审',
  '头脑风暴',
  'Q2规划',
]

export default function MeetingForm({ meeting, onSave, onCancel, defaultTitle, defaultDescription, defaultTags }: MeetingFormProps) {
  const [title, setTitle] = useState(meeting?.title || defaultTitle || '')
  const [startDate, setStartDate] = useState<Date | null>(
    meeting ? new Date(meeting.startTime) : null
  )
  const [endDate, setEndDate] = useState<Date | null>(
    meeting ? new Date(meeting.endTime) : null
  )
  const [description, setDescription] = useState(meeting?.description || defaultDescription || '')
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>(
    meeting?.participants || []
  )
  const [selectedTags, setSelectedTags] = useState<MeetingTag[]>(meeting?.tags || defaultTags || [])
  const [calendarConnected, setCalendarConnected] = useState(true)
  const [loading, setLoading] = useState(false)

  // 提交表单
  const handleSubmit = async () => {
    if (!title || !startDate || !endDate) return

    setLoading(true)
    try {
      const input: CreateMeetingInput = {
        title,
        startTime: startDate,
        endTime: endDate,
        description,
        participants: selectedParticipants,
        tags: selectedTags,
        status: 'scheduled',
        agendaItems: meeting?.agendaItems || [],
      }

      const newMeeting = await createMeeting(input)

      if (onSave) {
        onSave(newMeeting)
      }
    } catch (error) {
      console.error('创建会议失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCN}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* 会议标题 */}
        <TextField
          label="会议标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
          placeholder="输入会议标题..."
        />

        {/* 日期和时间 */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <MobileDatePicker
            label="日期"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            sx={{ flex: 1 }}
          />
          <TimePicker
            label="开始时间"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            sx={{ flex: 1 }}
          />
          <TimePicker
            label="结束时间"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            sx={{ flex: 1 }}
          />
        </Stack>

        {/* 描述 */}
        <TextField
          label="会议描述"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
          placeholder="输入会议描述..."
        />

        {/* 参会人 */}
        <Autocomplete
          multiple
          options={MOCK_USERS}
          getOptionLabel={(option) => option.name}
          value={selectedParticipants}
          onChange={(_event, newValue) => setSelectedParticipants(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="参会人" placeholder="搜索参会人..." />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip {...getTagProps({ index })} label={option.name} size="small" />
            ))
          }
        />

        {/* 关联日历 */}
        <FormControlLabel
          control={
            <Checkbox
              checked={calendarConnected}
              onChange={(e) => setCalendarConnected(e.target.checked)}
            />
          }
          label="关联日历"
        />

        {/* 标签 */}
        <FormControl fullWidth>
          <InputLabel>标签</InputLabel>
          <Select
            multiple
            value={selectedTags}
            onChange={(e) => setSelectedTags(e.target.value as MeetingTag[])}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            {AVAILABLE_TAGS.map((tag) => (
              <MenuItem key={tag} value={tag}>
                {tag}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>选择会议标签（可多选）</FormHelperText>
        </FormControl>

        {/* 操作按钮 */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
          {onCancel && (
            <Button onClick={onCancel} disabled={loading}>
              取消
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!title || !startDate || !endDate || loading}
            startIcon={calendarConnected ? '📅' : undefined}
          >
            {meeting ? '保存会议' : calendarConnected ? '保存并发送议程' : '保存会议'}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  )
}
