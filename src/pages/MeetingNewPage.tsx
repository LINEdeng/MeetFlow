/**
 * MeetingNewPage - 创建会议页面
 * 左右分栏：左侧表单 + 右侧议题编辑器
 * 支持 ?template=xxx 参数，自动从模板预填充议题
 */
import { useState, useEffect, useMemo } from 'react'
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import MeetingForm from '@/components/meeting/MeetingForm'
import AgendaEditor from '@/components/agenda/AgendaEditor'
import { Meeting, AgendaItem } from '@/types'
import { getTemplateById } from '@/constants/meeting-templates'

export default function MeetingNewPage() {
  const [searchParams] = useSearchParams()
  const templateId = searchParams.get('template')
  const template = useMemo(() => (templateId ? getTemplateById(templateId) : undefined), [templateId])

  const [createdMeeting, setCreatedMeeting] = useState<Meeting | null>(null)
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([])

  // 从模板初始化预设议程
  useEffect(() => {
    if (template && agendaItems.length === 0) {
      const presetItems: AgendaItem[] = template.presetAgenda.map((a, idx) => ({
        id: `preset-agenda-${Date.now()}-${idx}`,
        title: a.title,
        description: a.description,
        estimatedMinutes: a.estimatedMinutes,
        ownerId: a.ownerId || '',
        order: idx,
        isCompleted: false,
        createdAt: new Date(),
      }))
      setAgendaItems(presetItems)
    }
  }, [template]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleMeetingCreated = (meeting: Meeting) => {
    setCreatedMeeting(meeting)
  }

  const participants = createdMeeting?.participants || []

  return (
    <Container maxWidth="xl">
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {createdMeeting ? '编辑会议' : '创建新会议'}
          </Typography>
          {template && (
            <Chip
              icon={<AutoAwesomeIcon sx={{ fontSize: 14 }} />}
              label={`模板: ${template.name}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* 左侧：会议表单 */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              会议基本信息
            </Typography>
            <MeetingForm
              onSave={handleMeetingCreated}
              defaultTitle={template?.name}
              defaultDescription={template?.description}
              defaultTags={template?.tags}
            />
          </Paper>
        </Grid>

        {/* 右侧：议题编辑器 */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                议题编辑器
              </Typography>
              {template && agendaItems.length > 0 && (
                <Chip
                  label={`已从模板加载 ${agendaItems.length} 个议题`}
                  size="small"
                  color="success"
                />
              )}
            </Box>
            {createdMeeting || agendaItems.length > 0 ? (
              <AgendaEditor
                agendaItems={agendaItems}
                participants={participants}
                meetingId={createdMeeting?.id}
                onAdd={(item) => {
                  const newItem: AgendaItem = {
                    ...item,
                    id: `agenda-${Date.now()}`,
                    order: agendaItems.length,
                    isCompleted: false,
                    createdAt: new Date(),
                  }
                  setAgendaItems(prev => [...prev, newItem])
                }}
                onUpdate={(itemId, updates) => {
                  setAgendaItems(prev =>
                    prev.map(a => a.id === itemId ? { ...a, ...updates } : a)
                  )
                }}
                onDelete={(itemId) => {
                  setAgendaItems(prev => prev.filter(a => a.id !== itemId))
                }}
                onReorder={(reordered) => {
                  setAgendaItems(reordered)
                }}
              />
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography color="text.secondary">
                  请先填写左侧会议信息并保存
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
