/**
 * Layout - 页面布局容器
 */
import React from 'react'
import { Box, Container } from '@mui/material'
import Header from './Header'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#f5f5f5',
          py: 3,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Container maxWidth="xl" sx={{ px: 0 }}>
          {children}
        </Container>
      </Box>
    </Box>
  )
}
