/**
 * MyActionItems - 我的待办面板
 */
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText, ListItemIcon, Checkbox, Button, Chip } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import { useActionItemStore } from '@/store'
import { useUserStore } from '@/store'
import { formatDate } from '@/utils/date'

export default function MyActionItems() {
  const { actionItems } = useActionItemStore()
  const { currentUser } = useUserStore()

  const myTodoItems = actionItems
    .filter(item => item.ownerId === currentUser?.id && item.status === 'todo')
    .slice(0, 5)

  const isOverdue = (dueDate?: Date) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            我的待办
          </Typography>
          <Button size="small" component={RouterLink} to="/action-items">
            查看全部
          </Button>
        </Box>

        {myTodoItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              暂无待办事项
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {myTodoItems.map(item => (
              <ListItem
                key={item.id}
                sx={{
                  px: 0,
                  py: 1,
                  borderBottom: '1px solid #f0f0f0',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Checkbox edge="start" size="small" disabled />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.description}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      {item.dueDate && (
                        <Chip
                          label={`截止: ${formatDate(item.dueDate)}`}
                          size="small"
                          color={isOverdue(item.dueDate) ? 'error' : 'default'}
                          sx={{ height: 20, fontSize: '11px' }}
                        />
                      )}
                      {item.sourceMeetingTitle && (
                        <Typography variant="caption" color="text.disabled">
                          来自: {item.sourceMeetingTitle}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        <Button
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/action-items"
          fullWidth
          variant="outlined"
          sx={{ mt: 2 }}
        >
          新建任务
        </Button>
      </CardContent>
    </Card>
  )
}
