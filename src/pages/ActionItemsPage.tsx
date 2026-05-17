/**
 * ActionItemsPage - 行动项看板页面
 */
import { Typography, Box } from '@mui/material'
import ActionItemBoard from '@/components/action-item/ActionItemBoard'

export default function ActionItemsPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        行动项看板
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        拖拽卡片在"待办"、"进行中"、"已完成"三列之间移动
      </Typography>
      
      <ActionItemBoard />
    </Box>
  )
}
