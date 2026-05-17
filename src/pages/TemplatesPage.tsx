/**
 * TemplatesPage - 会议模板库页面
 */
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Stack,
  Chip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Link as RouterLink } from 'react-router-dom'
import { MEETING_TEMPLATES, MeetingTemplate } from '@/constants/meeting-templates'

function TemplateCard({ template }: { template: MeetingTemplate }) {
  const totalMinutes = template.presetAgenda.reduce((sum, a) => sum + a.estimatedMinutes, 0)

  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        {template.name}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
        {template.description}
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {template.tags.map((tag) => (
          <Chip key={tag} label={tag} size="small" />
        ))}
      </Stack>

      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5 }}>
          {template.presetAgenda.length} 个议题 · 建议时长 {totalMinutes} 分钟
        </Typography>
        {template.presetAgenda.slice(0, 3).map((agenda, idx) => (
          <Typography key={idx} variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {idx + 1}. {agenda.title}（{agenda.estimatedMinutes}分钟）
          </Typography>
        ))}
        {template.presetAgenda.length > 3 && (
          <Typography variant="caption" color="text.disabled">
            ...还有 {template.presetAgenda.length - 3} 个议题
          </Typography>
        )}
      </Box>

      <Button
        variant="contained"
        fullWidth
        component={RouterLink}
        to={`/meetings/new?template=${template.id}`}
        startIcon={<AddIcon />}
      >
        使用此模板
      </Button>
    </Paper>
  )
}

export default function TemplatesPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          会议模板库
        </Typography>
        <Typography color="text.secondary">
          选择合适的模板快速创建会议，自动预填议题和议程
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {MEETING_TEMPLATES.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <TemplateCard template={template} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
