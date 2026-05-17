/**
 * SettingsPage - 设置页面
 */
import React from 'react'
import {
  Container,
  Box,
  Typography,
  Paper,
  FormControl,
  FormLabel,
  Switch,
  TextField,
  Button,
  Stack,
} from '@mui/material'
import { useUserStore } from '@/store'

export default function SettingsPage() {
  const { currentUser, updateUser } = useUserStore()
  
  const [reminderMinutes, setReminderMinutes] = React.useState(
    currentUser?.notificationPrefs?.reminderMinutesBefore || 15
  )
  const [emailNotifications, setEmailNotifications] = React.useState(
    currentUser?.notificationPrefs?.emailNotifications || false
  )
  const [beforeMeeting, setBeforeMeeting] = React.useState(
    currentUser?.notificationPrefs?.beforeMeeting !== undefined
      ? currentUser.notificationPrefs.beforeMeeting
      : true
  )
  
  const handleSave = () => {
    if (currentUser) {
      updateUser({
        notificationPrefs: {
          beforeMeeting,
          reminderMinutesBefore: reminderMinutes,
          emailNotifications,
        },
      })
      alert('设置已保存')
    }
  }
  
  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          设置
        </Typography>
        <Typography color="text.secondary">
          管理你的偏好设置
        </Typography>
      </Box>
      
      <Stack spacing={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            通知设置
          </Typography>
          
          <Stack spacing={3}>
            <FormControl>
              <FormLabel>会前提醒</FormLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Switch
                  checked={beforeMeeting}
                  onChange={(e) => setBeforeMeeting(e.target.checked)}
                />
                <Typography>会议开始前提醒</Typography>
              </Box>
            </FormControl>
            
            {beforeMeeting && (
              <TextField
                label="提前提醒时间（分钟）"
                type="number"
                value={reminderMinutes}
                onChange={(e) => setReminderMinutes(Number(e.target.value))}
                sx={{ maxWidth: 300 }}
                inputProps={{ min: 1, max: 60 }}
              />
            )}
            
            <FormControl>
              <FormLabel>邮件通知</FormLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Switch
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
                <Typography>启用邮件通知</Typography>
              </Box>
            </FormControl>
          </Stack>
        </Paper>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            用户信息
          </Typography>
          
          <Stack spacing={2}>
            <TextField
              label="姓名"
              defaultValue={currentUser?.name || ''}
              disabled
              sx={{ maxWidth: 400 }}
            />
            <TextField
              label="邮箱"
              defaultValue={currentUser?.email || ''}
              disabled
              sx={{ maxWidth: 400 }}
            />
          </Stack>
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSave}>
            保存设置
          </Button>
        </Box>
      </Stack>
    </Container>
  )
}
