/**
 * DashboardPage - 仪表盘页面
 */
import { Container, Box } from '@mui/material'
import TodayOverview from '@/components/dashboard/TodayOverview'
import UpcomingMeeting from '@/components/dashboard/UpcomingMeeting'
import MyActionItems from '@/components/dashboard/MyActionItems'
import RecentMeetings from '@/components/dashboard/RecentMeetings'

export default function DashboardPage() {
  return (
    <Container maxWidth="xl">
      {/* 今日概览 */}
      <Box sx={{ mb: 4 }}>
        <TodayOverview />
      </Box>

      {/* 即将开始 + 我的待办 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          mb: 4,
        }}
      >
        <UpcomingMeeting />
        <MyActionItems />
      </Box>

      {/* 最近会议 */}
      <RecentMeetings />
    </Container>
  )
}
