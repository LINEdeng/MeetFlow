/**
 * MeetingDetailPage - 会议详情页面
 * Tab 切换：议程/会议纪要/行动项/录音转写
 */
import { useState } from 'react'
import {
  Container,
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Stack,
  Chip,
  IconButton,
  Paper,
  Skeleton,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import { Link as RouterLink } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useMeeting } from '@/hooks/useMeeting'
import { AgendaItem } from '@/types'
import StatusBadge from '@/components/common/StatusBadge'
import MeetingForm from '@/components/meeting/MeetingForm'
import AgendaEditor from '@/components/agenda/AgendaEditor'
import MinutesGenerator from '@/components/minutes/MinutesGenerator'
import MinutesViewer from '@/components/minutes/MinutesViewer'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`meeting-tabpanel-${index}`}
      {...other}
      sx={{ py: 3 }}
    >
      {value === index && children}
    </Box>
  )
}

export default function MeetingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { meeting, agendaItems, actionItems, minutes, isLoading, generateMeetingMinutes } = useMeeting(id!)
  
  const [tabValue, setTabValue] = useState(0)
  const [editMode, setEditMode] = useState(false)
  
  if (isLoading || !meeting) {
    return (
      <Container maxWidth="lg">
        <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} />
      </Container>
    )
  }
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }
  
  const participants = meeting.participants || []
  
  return (
    <Container maxWidth="lg">
      {/* 返回按钮和标题 */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          component={RouterLink}
          to="/meetings"
          sx={{ mb: 2 }}
        >
          返回列表
        </Button>
        
        {editMode ? (
          <MeetingForm
            meeting={meeting}
            onSave={(_data) => {
              setEditMode(false)
            }}
            onCancel={() => setEditMode(false)}
          />
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {meeting.title}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Chip label={meeting.startTime.toLocaleDateString()} size="small" />
                  <Chip label={`${meeting.startTime.toLocaleTimeString()} - ${meeting.endTime.toLocaleTimeString()}`} size="small" />
                  <StatusBadge status={meeting.status} />
                </Stack>
                <Stack direction="row" spacing={1}>
                  {meeting.tags?.map((tag) => (
                    <Chip key={tag} label={tag} size="small" color="primary" variant="outlined" />
                  ))}
                </Stack>
              </Box>
              <IconButton onClick={() => setEditMode(true)}>
                <EditIcon />
              </IconButton>
            </Box>
          </>
        )}
      </Box>
      
      {/* Tab 切换 */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`议程 (${agendaItems.length})`} />
          <Tab label="会议纪要" />
          <Tab label={`行动项 (${actionItems.length})`} />
          <Tab label="录音转写" />
        </Tabs>
        
        {/* 议程 Tab */}
        <TabPanel value={tabValue} index={0}>
          <AgendaEditor
            agendaItems={agendaItems}
            participants={participants}
            onAdd={async (_item) => {
              // 添加议题逻辑（此处为展示用，实际可接入 store）
            }}
            onUpdate={async (_id, _updates) => {
              // 更新议题逻辑
            }}
            onDelete={async (_id) => {
              // 删除议题逻辑
            }}
            onReorder={async (_items: AgendaItem[]) => {
              // 重新排序逻辑
            }}
          />
        </TabPanel>
        
        {/* 会议纪要 Tab */}
        <TabPanel value={tabValue} index={1}>
          {meeting.status === 'completed' && !minutes ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <MinutesGenerator
                meetingId={meeting.id}
                onGenerate={generateMeetingMinutes}
              />
            </Box>
          ) : minutes ? (
            <MinutesViewer minutes={minutes} meeting={meeting} />
          ) : (
            <Typography color="text.secondary">
              会议结束后可生成会议纪要
            </Typography>
          )}
        </TabPanel>
        
        {/* 行动项 Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              行动项列表
            </Typography>
            {actionItems.length === 0 ? (
              <Typography color="text.secondary">
                暂无行动项，请在会议纪要中生成或手动添加
              </Typography>
            ) : (
              <Box>
                {actionItems.map((item) => (
                  <Paper key={item.id} sx={{ p: 2, mb: 1 }}>
                    <Typography>{item.description}</Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        </TabPanel>
        
        {/* 录音转写 Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography color="text.secondary">
            录音转写功能开发中...
          </Typography>
        </TabPanel>
      </Paper>
    </Container>
  )
}
