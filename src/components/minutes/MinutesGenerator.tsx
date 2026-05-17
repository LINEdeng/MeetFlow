/**
 * MinutesGenerator - AI 生成纪要按钮 + 进度
 */
import React from 'react'
import { Button, Box, Typography, LinearProgress } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { MeetingMinutes } from '@/types'

interface MinutesGeneratorProps {
  meetingId: string
  onGenerate: (meetingId: string) => Promise<MeetingMinutes>
}

export default function MinutesGenerator({ meetingId, onGenerate }: MinutesGeneratorProps) {
  const [generating, setGenerating] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const handleGenerate = async () => {
    setGenerating(true)
    setProgress(0)

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90))
    }, 150)

    try {
      await onGenerate(meetingId)
      clearInterval(progressInterval)
      setProgress(100)
    } catch (error) {
      clearInterval(progressInterval)
    } finally {
      setTimeout(() => {
        setGenerating(false)
        setProgress(0)
      }, 500)
    }
  }

  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<AutoAwesomeIcon />}
        onClick={handleGenerate}
        disabled={generating}
        sx={{ mb: 2 }}
      >
        {generating ? 'AI 正在生成纪要...' : '✨ AI 生成纪要'}
      </Button>

      {generating && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            {progress}% 完成
          </Typography>
        </Box>
      )}
    </Box>
  )
}
