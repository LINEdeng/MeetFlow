/**
 * useMeetings - 会议列表查询、筛选、搜索 Hook
 *
 * filteredMeetings 同时响应 searchQuery、statusFilter、tagFilter 三个条件，
 * 当任一条件变化时自动重新计算，无需手动调用搜索。
 */
import { useState, useMemo, useEffect, useCallback } from 'react'
import { MeetingStatus, MeetingTag } from '@/types'
import { useMeetingStore } from '@/store'

export function useMeetings() {
  const {
    meetings,
    isLoading,
    error,
    fetchMeetings,
    getMeetingsByStatus,
    getTodaysMeetings,
    getUpcomingMeetings,
  } = useMeetingStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<MeetingStatus | 'all'>('all')
  const [tagFilter, setTagFilter] = useState<MeetingTag | 'all'>('all')

  // 初始化时获取会议列表
  useEffect(() => {
    fetchMeetings()
  }, [fetchMeetings])

  // 过滤后的会议列表（响应 searchQuery + statusFilter + tagFilter）
  const filteredMeetings = useMemo(() => {
    let result = [...meetings]

    // 搜索过滤：匹配标题、描述、标签
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(m =>
        m.title.toLowerCase().includes(q) ||
        (m.description && m.description.toLowerCase().includes(q)) ||
        m.tags.some(t => t.toLowerCase().includes(q))
      )
    }

    // 状态筛选
    if (statusFilter !== 'all') {
      result = result.filter(m => m.status === statusFilter)
    }

    // 标签筛选
    if (tagFilter !== 'all') {
      result = result.filter(m => m.tags.includes(tagFilter))
    }

    return result
  }, [meetings, searchQuery, statusFilter, tagFilter])

  // 搜索处理（仅更新本地状态，filteredMeetings 会自动重算）
  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query)
    },
    []
  )

  return {
    meetings,
    filteredMeetings,
    isLoading,
    error,
    searchQuery,
    statusFilter,
    tagFilter,
    setSearchQuery,
    setStatusFilter,
    setTagFilter,
    handleSearch,
    getMeetingsByStatus,
    getTodaysMeetings,
    getUpcomingMeetings,
    refetch: fetchMeetings,
  }
}
