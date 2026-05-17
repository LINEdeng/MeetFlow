/**
 * RecentMeetings - 最近会议列表
 */
import { Card, CardContent, Typography, List, ListItem, ListItemText, Box, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import DescriptionIcon from '@mui/icons-material/Description'
import { useMeetingStore } from '@/store'
import { formatDate } from '@/utils/date'

export default function RecentMeetings() {
  const { meetings } = useMeetingStore()

  const recentMeetings = meetings
    .filter(m => m.status === 'completed')
    .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            最近会议
          </Typography>
          <Button size="small" component={RouterLink} to="/meetings">
            查看全部
          </Button>
        </Box>

        {recentMeetings.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              暂无会议记录
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {recentMeetings.map(meeting => (
              <ListItem
                key={meeting.id}
                component={RouterLink}
                to={`/meetings/${meeting.id}`}
                sx={{
                  px: 0,
                  py: 1,
                  borderBottom: '1px solid #f0f0f0',
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:last-child': { borderBottom: 'none' },
                  '&:hover': { backgroundColor: '#f9f9f9' },
                }}
              >
                <DescriptionIcon sx={{ mr: 2, color: 'primary.main', fontSize: 20 }} />
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {meeting.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.disabled">
                      {formatDate(meeting.startTime)}
                      {meeting.minutes ? ' | 含纪要' : ''}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}
