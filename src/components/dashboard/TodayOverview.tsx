/**
 * TodayOverview - 今日概览统计卡片
 */
import { Card, CardContent, Typography, Grid, Box } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AssignmentIcon from '@mui/icons-material/Assignment'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import { useMeetingStore } from '@/store'
import { useActionItemStore } from '@/store'
import { formatTime } from '@/utils/date'

export default function TodayOverview() {
  const { meetings } = useMeetingStore()
  const { actionItems } = useActionItemStore()

  // 今日会议
  const todayMeetings = meetings.filter(
    m => new Date(m.startTime).toDateString() === new Date().toDateString()
  )

  // 待办行动项统计
  const todoItems = actionItems.filter(item => item.status === 'todo')
  const completedToday = actionItems.filter(
    item =>
      item.status === 'completed' &&
      item.completedAt &&
      new Date(item.completedAt).toDateString() === new Date().toDateString()
  )

  // 下一场会议
  const now = new Date()
  const upcomingMeeting = meetings
    .filter(m => new Date(m.startTime) > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0]

  const stats = [
    {
      icon: <MeetingRoomIcon />,
      label: '今日会议',
      value: todayMeetings.length,
      subLabel: `${todayMeetings.filter(m => m.status === 'completed').length} 场已结束`,
      color: '#635bff',
    },
    {
      icon: <AssignmentIcon />,
      label: '待办行动项',
      value: todoItems.length,
      subLabel: `已完成今日 ${completedToday.length} 项`,
      color: '#d946ef',
    },
    {
      icon: <CheckCircleIcon />,
      label: '待办完成',
      value: `${completedToday.length}/${todoItems.length + completedToday.length}`,
      subLabel: '完成进度',
      color: '#10b981',
    },
    {
      icon: <AccessTimeIcon />,
      label: '下一场',
      value: upcomingMeeting ? formatTime(upcomingMeeting.startTime) : '无',
      subLabel: upcomingMeeting?.title || '暂无会议',
      color: '#f59e0b',
    },
  ]

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            sx={{
              height: '100%',
              transition: 'all 0.2s',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor: `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {stat.subLabel}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
