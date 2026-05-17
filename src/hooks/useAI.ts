/**
 * useAI - AI 功能调用 Hook（模拟）
 */
import { useState, useCallback } from 'react'
import { MeetingMinutes } from '@/types'
import { generateMinutes, transcribeAudio } from '@/services/ai.service.mock'
import toast from 'react-hot-toast'

export function useAI() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  
  // 生成会议纪要
  const handleGenerateMinutes = useCallback(
    async (meetingId: string): Promise<MeetingMinutes> => {
      setIsGenerating(true)
      setProgress(0)
      
      try {
        // 模拟进度更新
        const progressInterval = setInterval(() => {
          setProgress(prev => Math.min(prev + 10, 90))
        }, 150)
        
        const minutes = await generateMinutes(meetingId)
        
        clearInterval(progressInterval)
        setProgress(100)
        
        toast.success('会议纪要生成完成')
        return minutes
      } catch (error) {
        toast.error('会议纪要生成失败')
        throw error
      } finally {
        setIsGenerating(false)
        setProgress(0)
      }
    },
    []
  )
  
  // 转录音频（预留接口）
  const handleTranscribeAudio = useCallback(
    async (audioUrl: string): Promise<any[]> => {
      setIsGenerating(true)
      try {
        const result = await transcribeAudio(audioUrl)
        toast.success('音频转写完成')
        return result
      } catch (error) {
        toast.error('音频转写失败')
        throw error
      } finally {
        setIsGenerating(false)
      }
    },
    []
  )
  
  return {
    isGenerating,
    progress,
    generateMinutes: handleGenerateMinutes,
    transcribeAudio: handleTranscribeAudio,
  }
}
