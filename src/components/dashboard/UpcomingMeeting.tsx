/**
 * UpcomingMeeting - 即将开始会议卡片
 */
import { Card, CardContent, Typography, Box, Button, Stack, Avatar } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PeopleIcon from '@mui/icons-material/People'
import ListAltIcon from '@mui/icons-material/ListAlt'
import { useMeetingStore } from '@/store'
import { formatTime, formatDuration, getDurationMinutes } from '@/utils/date'

export default function UpcomingMeeting() {
  const { meetings } = useMeetingStore()

  const now = new Date()
  const upcomingMeeting = meetings
    .filter(m => new Date(m.startTime) > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0]

  if (!upcomingMeeting) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            即将开始
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              暂无即将开始的会议
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  const duration = getDurationMinutes(upcomingMeeting.startTime, upcomingMeeting.endTime)

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          即将开始
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          📌 {upcomingMeeting.title}
        </Typography>

        <Stack spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {formatTime(upcomingMeeting.startTime)} - {formatTime(upcomingMeeting.endTime)}
              <Typography component="span" color="text.disabled" sx={{ ml: 1 }}>
                ({formatDuration(duration)})
              </Typography>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {upcomingMeeting.participants.length}人参会
            </Typography>
            <Avatar sx={{ width: 24, height: 24, fontSize: '12px', bgcolor: 'primary.main' }}>
              {upcomingMeeting.participants.length}
            </Avatar>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ListAltIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {upcomingMeeting.agendaItems.length}个议题
            </Typography>
          </Box>
        </Stack>

        <Button variant="contained" component={RouterLink} to={`/meetings/${upcomingMeeting.id}`} fullWidth>
          进入准备
        </Button>
      </CardContent>
    </Card>
  )
}
