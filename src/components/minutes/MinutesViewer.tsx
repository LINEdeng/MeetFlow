/**
 * MinutesViewer - 会议纪要查看/编辑组件
 * 支持导出为 Markdown / PDF
 */
import { useState } from 'react'
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, Divider, Chip, LinearProgress, Button, Menu, MenuItem, ListItemIcon as MUIListItemIcon } from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import ArticleIcon from '@mui/icons-material/Article'
import { MeetingMinutes, Meeting } from '@/types'
import { exportToMarkdown, downloadMarkdown, exportToPDF } from '@/utils/export'

interface MinutesViewerProps {
  minutes: MeetingMinutes
  meeting?: Meeting
}

export default function MinutesViewer({ minutes, meeting }: MinutesViewerProps) {
  const [exportAnchor, setExportAnchor] = useState<null | HTMLElement>(null)

  if (!minutes) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          暂无会议纪要
        </Typography>
      </Box>
    )
  }

  const handleExportMarkdown = () => {
    if (!meeting) return
    const md = exportToMarkdown(meeting, minutes)
    downloadMarkdown(meeting.title, md)
    setExportAnchor(null)
  }

  const handleExportPDF = async () => {
    if (!meeting) return
    try {
      await exportToPDF('meeting-minutes-content', meeting.title)
    } catch {
      // 如果 html2canvas 导出失败，回退到 Markdown
      const md = exportToMarkdown(meeting, minutes)
      downloadMarkdown(meeting.title, md)
    }
    setExportAnchor(null)
  }

  return (
    <Box id="meeting-minutes-content">
      {/* 导出按钮 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<FileDownloadIcon />}
          onClick={(e) => setExportAnchor(e.currentTarget)}
        >
          导出纪要
        </Button>
        <Menu
          anchorEl={exportAnchor}
          open={Boolean(exportAnchor)}
          onClose={() => setExportAnchor(null)}
        >
          <MenuItem onClick={handleExportMarkdown}>
            <MUIListItemIcon sx={{ minWidth: 36 }}>
              <ArticleIcon fontSize="small" />
            </MUIListItemIcon>
            导出为 Markdown
          </MenuItem>
          <MenuItem onClick={handleExportPDF}>
            <MUIListItemIcon sx={{ minWidth: 36 }}>
              <PictureAsPdfIcon fontSize="small" />
            </MUIListItemIcon>
            导出为 PDF
          </MenuItem>
        </Menu>
      </Box>

      {/* 摘要 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          摘要
        </Typography>
        <Paper sx={{ p: 3, backgroundColor: '#f9f9f9' }} elevation={0}>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {minutes.summary}
          </Typography>
        </Paper>
      </Box>

      {/* 关键决策 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          关键决策
        </Typography>
        <List>
          {minutes.keyDecisions.map((decision, index) => (
            <ListItem key={decision.id} sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                  }}
                >
                  {index + 1}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={decision.content}
                secondary={`决策人: ${decision.decidedBy}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* 争议点 */}
      {minutes.controversies.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            争议点
          </Typography>
          <List>
            {minutes.controversies.map(controversy => (
              <ListItem key={controversy.id} sx={{ px: 0 }}>
                <ListItemText
                  primary={controversy.content}
                  secondary={`相关参会人: ${controversy.relatedParticipants.join(', ')}`}
                />
                <Chip
                  label={controversy.status === 'open' ? '未解决' : '已解决'}
                  size="small"
                  color={controversy.status === 'open' ? 'warning' : 'success'}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* 发言统计 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          发言统计
        </Typography>
        <Box>
          {minutes.speakingStats.map(stat => (
            <Box key={stat.speakerId} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">{stat.speakerName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.percentage}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={stat.percentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#f0f0f0',
                  '& .MuiLinearProgress-bar': { borderRadius: 4 },
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="caption" color="text.disabled">
        纪要生成时间: {new Date(minutes.generatedAt).toLocaleString()}
        {minutes.isEdited && ' (已编辑)'}
      </Typography>
    </Box>
  )
}
