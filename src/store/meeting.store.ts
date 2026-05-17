/**
 * MeetingStore - 会议状态管理
 */
import { create } from 'zustand'
import { Meeting, CreateMeetingInput } from '@/types'
import * as meetingService from '@/services/meeting.service'
import { initializeMockData } from '@/constants/mock-data'

interface MeetingStore {
  meetings: Meeting[]
  currentMeeting: Meeting | null
  isLoading: boolean
  error: string | null
  
  // 操作方法
  fetchMeetings: () => Promise<void>
  fetchMeetingById: (id: string) => Promise<void>
  createMeeting: (input: CreateMeetingInput) => Promise<Meeting>
  updateMeeting: (id: string, updates: Partial<Meeting>) => Promise<void>
  deleteMeeting: (id: string) => Promise<void>
  searchMeetings: (query: string) => Promise<Meeting[]>
  
  // 辅助方法
  getMeetingsByStatus: (status: Meeting['status']) => Meeting[]
  getTodaysMeetings: () => Meeting[]
  getUpcomingMeetings: () => Meeting[]
}

export const useMeetingStore = create<MeetingStore>((set, get) => ({
  meetings: [],
  currentMeeting: null,
  isLoading: false,
  error: null,
  
  fetchMeetings: async () => {
    set({ isLoading: true, error: null })
    try {
      // 初始化 Mock 数据（如果未初始化）
      initializeMockData()
      
      const meetings = await meetingService.getMeetings()
      set({ meetings, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },
  
  fetchMeetingById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const meeting = await meetingService.getMeetingById(id)
      set({ currentMeeting: meeting || null, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },
  
  createMeeting: async (input: CreateMeetingInput) => {
    set({ isLoading: true, error: null })
    try {
      const newMeeting = await meetingService.createMeeting(input)
      set(state => ({
        meetings: [...state.meetings, newMeeting],
        isLoading: false,
      }))
      return newMeeting
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },
  
  updateMeeting: async (id: string, updates: Partial<Meeting>) => {
    set({ isLoading: true, error: null })
    try {
      const updatedMeeting = await meetingService.updateMeeting(id, updates)
      set(state => ({
        meetings: state.meetings.map(m => (m.id === id ? updatedMeeting : m)),
        currentMeeting: state.currentMeeting?.id === id ? updatedMeeting : state.currentMeeting,
        isLoading: false,
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },
  
  deleteMeeting: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await meetingService.deleteMeeting(id)
      set(state => ({
        meetings: state.meetings.filter(m => m.id !== id),
        currentMeeting: state.currentMeeting?.id === id ? null : state.currentMeeting,
        isLoading: false,
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },
  
  searchMeetings: async (query: string) => {
    try {
      return await meetingService.searchMeetings(query)
    } catch (error) {
      set({ error: (error as Error).message })
      return []
    }
  },
  
  getMeetingsByStatus: (status: Meeting['status']) => {
    return get().meetings.filter(m => m.status === status)
  },
  
  getTodaysMeetings: () => {
    const today = new Date().toDateString()
    return get().meetings.filter(m => new Date(m.startTime).toDateString() === today)
  },
  
  getUpcomingMeetings: () => {
    const now = new Date()
    return get().meetings
      .filter(m => new Date(m.startTime) > now && m.status === 'scheduled')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  },
}))
