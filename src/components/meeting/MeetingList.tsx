/**
 * MeetingList - 会议列表组件（带筛选）
 */
import React from 'react'
import { Box, Grid, Typography, Pagination } from '@mui/material'
import MeetingCard from './MeetingCard'
import EmptyState from '@/components/common/EmptyState'
import { Meeting } from '@/types'

interface MeetingListProps {
  meetings: Meeting[]
  isLoading?: boolean
  showCreateButton?: boolean
  onCreateClick?: () => void
}

export default function MeetingList({
  meetings,
  isLoading = false,
  showCreateButton = false,
  onCreateClick,
}: MeetingListProps) {
  const [page, setPage] = React.useState(1)
  const itemsPerPage = 9

  const pageCount = Math.ceil(meetings.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const paginatedMeetings = meetings.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <Typography>加载中...</Typography>
      </Box>
    )
  }

  if (meetings.length === 0) {
    return (
      <EmptyState
        title="暂无会议"
        description="点击右侧按钮创建新会议"
        actionLabel={showCreateButton ? '创建会议' : undefined}
        onAction={onCreateClick}
        icon="📅"
      />
    )
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {paginatedMeetings.map(meeting => (
          <Grid item xs={12} sm={6} md={4} key={meeting.id}>
            <MeetingCard meeting={meeting} />
          </Grid>
        ))}
      </Grid>

      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  )
}
