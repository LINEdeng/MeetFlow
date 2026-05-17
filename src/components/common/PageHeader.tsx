/**
 * PageHeader - 页面标题 + 操作按钮组件
 */
import React from 'react'
import { Box, Typography, Breadcrumbs, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: { label: string; path?: string }[]
  action?: React.ReactNode
}

export default function PageHeader({ title, subtitle, breadcrumbs, action }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs && (
        <Breadcrumbs sx={{ mb: 1, fontSize: '14px' }}>
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={item.label}>
              {item.path && index < breadcrumbs.length - 1 ? (
                <Link
                  component={RouterLink}
                  to={item.path}
                  color="text.secondary"
                  sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  {item.label}
                </Link>
              ) : (
                <Typography color="text.primary" sx={{ fontSize: '14px' }}>
                  {item.label}
                </Typography>
              )}
            </React.Fragment>
          ))}
        </Breadcrumbs>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && <Box>{action}</Box>}
      </Box>
    </Box>
  )
}
