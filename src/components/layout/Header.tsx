/**
 * Header - 顶部导航栏
 */
import { AppBar, Toolbar, Typography, Box, Avatar, Badge, IconButton, InputBase, Paper } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useUserStore } from '@/store'

export default function Header() {
  const { currentUser } = useUserStore()

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'white',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* 左侧 Logo 和标题 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #635bff 0%, #d946ef 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #635bff 0%, #d946ef 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              M
            </Box>
            MeetFlow
          </Typography>
        </Box>

        {/* 中间搜索栏 */}
        <Paper
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 0.5,
            borderRadius: 2,
            backgroundColor: '#f5f5f5',
            flex: 1,
            maxWidth: 480,
            mx: 3,
          }}
          elevation={0}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase
            placeholder="搜索会议、行动项..."
            sx={{ flex: 1, fontSize: '14px' }}
          />
        </Paper>

        {/* 右侧通知和用户头像 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton>
            <Badge badgeContent={3} color="primary">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {currentUser?.name.charAt(0)}
            </Avatar>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {currentUser?.name || '用户'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentUser?.email || ''}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
