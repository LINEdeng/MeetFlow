/**
 * MeetingCard - 会议卡片组件（列表页）
 */
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  AvatarGroup,
  Avatar,
  LinearProgress,
  useTheme,
} from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PeopleIcon from '@mui/icons-material/People'
import { Link as RouterLink } from 'react-router-dom'
import { Meeting } from '@/types'
import { formatDate, formatTime, getDurationMinutes } from '@/utils/date'
import StatusBadge from '@/components/common/StatusBadge'

interface MeetingCardProps {
  meeting: Meeting
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const theme = useTheme()

  // 计算行动项完成进度
  const totalActions = meeting.actionItems?.length || 0
  const completedActions =
    meeting.actionItems?.filter(item => item.status === 'completed').length || 0
  const actionProgress = totalActions > 0 ? (completedActions / totalActions) * 100 : 0

  const duration = getDurationMinutes(meeting.startTime, meeting.endTime)

  return (
    <Card
      component={RouterLink}
      to={`/meetings/${meeting.id}`}
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* 顶部：状态和标签 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <StatusBadge status={meeting.status} />
          <Stack direction="row" spacing={0.5}>
            {meeting.tags.map(tag => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.dark,
                  fontSize: '12px',
                  height: 24,
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* 标题 */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
          {meeting.title}
        </Typography>

        {/* 时间和参会人 */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(meeting.startTime)} {formatTime(meeting.startTime)}-{formatTime(meeting.endTime)}
              <Typography component="span" color="text.disabled" sx={{ ml: 1 }}>
                ({duration}分钟)
              </Typography>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {meeting.participants.length}人参会
            </Typography>
            <AvatarGroup
              max={4}
              sx={{ ml: 1, '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '12px' } }}
            >
              {meeting.participants.map(p => (
                <Avatar key={p.id} alt={p.name}>
                  {p.name.charAt(0)}
                </Avatar>
              ))}
            </AvatarGroup>
          </Box>
        </Stack>

        {/* 议题数 */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {meeting.agendaItems.length} 个议题
        </Typography>

        {/* 行动项进度 */}
        {totalActions > 0 && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                行动项
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {completedActions}/{totalActions}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={actionProgress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': { borderRadius: 3 },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
