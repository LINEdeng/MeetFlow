/**
 * useMeeting - 单个会议详情 Hook
 */
import { useState, useEffect, useCallback } from 'react'
import { Meeting, AgendaItem, ActionItem, MeetingMinutes } from '@/types'
import { useMeetingStore } from '@/store'
import { useActionItemStore } from '@/store'
import * as agendaService from '@/services/agenda.service'
import * as minutesService from '@/services/minutes.service'
import { generateMinutes } from '@/services/ai.service.mock'
import toast from 'react-hot-toast'

export function useMeeting(meetingId: string) {
  const { currentMeeting, isLoading, error, fetchMeetingById, updateMeeting } = useMeetingStore()
  const { fetchActionItemsByMeetingId } = useActionItemStore()
  
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([])
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [minutes, setMinutes] = useState<MeetingMinutes | undefined>(undefined)
  const [generatingMinutes, setGeneratingMinutes] = useState(false)
  
  // 获取会议详情
  useEffect(() => {
    if (meetingId) {
      fetchMeetingById(meetingId)
      loadRelatedData(meetingId)
    }
  }, [meetingId, fetchMeetingById])
  
  // 加载关联数据
  const loadRelatedData = useCallback(async (id: string) => {
    try {
      const [agenda, actions, minutesData] = await Promise.all([
        // 从会议对象中获取 agendaItems
        Promise.resolve(currentMeeting?.agendaItems || []),
        fetchActionItemsByMeetingId(id),
        minutesService.getMinutesByMeetingId(id),
      ])
      
      setAgendaItems(agenda)
      setActionItems(actions)
      setMinutes(minutesData)
    } catch (error) {
      console.error('加载关联数据失败:', error)
    }
  }, [currentMeeting, fetchActionItemsByMeetingId])
  
  // 更新会议
  const handleUpdateMeeting = useCallback(
    async (updates: Partial<Meeting>) => {
      await updateMeeting(meetingId, updates)
    },
    [meetingId, updateMeeting]
  )
  
  // 添加议题
  const addAgendaItem = useCallback(
    async (item: Omit<AgendaItem, 'id' | 'order' | 'isCompleted' | 'createdAt'>) => {
      try {
        const newItem = await agendaService.addAgendaItem(meetingId, item)
        setAgendaItems(prev => [...prev, newItem])
        toast.success('议题添加成功')
        return newItem
      } catch (error) {
        toast.error('添加议题失败')
        throw error
      }
    },
    [meetingId]
  )
  
  // 更新议题
  const updateAgendaItem = useCallback(
    async (itemId: string, updates: Partial<AgendaItem>) => {
      try {
        const updatedItem = await agendaService.updateAgendaItem(meetingId, itemId, updates)
        setAgendaItems(prev => prev.map(item => (item.id === itemId ? updatedItem : item)))
        toast.success('议题更新成功')
        return updatedItem
      } catch (error) {
        toast.error('更新议题失败')
        throw error
      }
    },
    [meetingId]
  )
  
  // 删除议题
  const deleteAgendaItem = useCallback(
    async (itemId: string) => {
      try {
        await agendaService.deleteAgendaItem(meetingId, itemId)
        setAgendaItems(prev => prev.filter(item => item.id !== itemId))
        toast.success('议题删除成功')
      } catch (error) {
        toast.error('删除议题失败')
        throw error
      }
    },
    [meetingId]
  )
  
  // 重新排序议题
  const reorderAgendaItems = useCallback(
    async (reorderedItems: AgendaItem[]) => {
      try {
        const updatedItems = await agendaService.reorderAgendaItems(meetingId, reorderedItems)
        setAgendaItems(updatedItems)
      } catch (error) {
        toast.error('排序失败')
        throw error
      }
    },
    [meetingId]
  )
  
  // 生成会议纪要（AI）
  const generateMeetingMinutes = useCallback(async () => {
    setGeneratingMinutes(true)
    try {
      const minutesData = await generateMinutes(meetingId)
      await minutesService.saveMinutes(meetingId, minutesData)
      setMinutes(minutesData)
      toast.success('纪要生成成功')
      return minutesData
    } catch (error) {
      toast.error('纪要生成失败')
      throw error
    } finally {
      setGeneratingMinutes(false)
    }
  }, [meetingId])
  
  return {
    meeting: currentMeeting,
    agendaItems,
    actionItems,
    minutes,
    isLoading,
    error,
    generatingMinutes,
    
    updateMeeting: handleUpdateMeeting,
    addAgendaItem,
    updateAgendaItem,
    deleteAgendaItem,
    reorderAgendaItems,
    generateMeetingMinutes,
    refetch: () => fetchMeetingById(meetingId),
  }
}
