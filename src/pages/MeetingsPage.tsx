/**
 * MeetingsPage - 会议列表页面
 */
import { Typography, Box, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Link as RouterLink } from 'react-router-dom'
import { useMeetings } from '@/hooks/useMeetings'
import MeetingSearch from '@/components/meeting/MeetingSearch'
import MeetingFilters from '@/components/meeting/MeetingFilters'
import MeetingList from '@/components/meeting/MeetingList'

export default function MeetingsPage() {
  const {
    searchQuery,
    statusFilter,
    tagFilter,
    setSearchQuery,
    setStatusFilter,
    setTagFilter,
    handleSearch,
    filteredMeetings,
    isLoading,
  } = useMeetings()

  return (
    <Box>
      {/* 页面标题和操作 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          全部会议
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/meetings/new"
        >
          创建会议
        </Button>
      </Box>

      {/* 搜索和筛选 */}
      <Box sx={{ mb: 3 }}>
        <MeetingSearch
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="搜索会议标题、描述或标签..."
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <MeetingFilters
          statusFilter={statusFilter}
          tagFilter={tagFilter}
          onStatusChange={setStatusFilter}
          onTagChange={setTagFilter}
        />
      </Box>

      {/* 会议列表 */}
      <MeetingList
        meetings={filteredMeetings}
        isLoading={isLoading}
        showCreateButton
        onCreateClick={() => (window.location.href = '/meetings/new')}
      />
    </Box>
  )
}
