/**
 * AIService - Mock AI 功能（模拟转写和纪要生成）
 * 使用确定性算法（基于 meetingId 的 hash）生成可重复的模拟数据
 */
import { MeetingMinutes, KeyDecision, ControversyPoint, TranscriptSegment, SpeakingStat } from '@/types'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟纪要模板
const MOCK_SUMMARIES = [
  '本次会议围绕产品路线图展开讨论，确认了三个核心功能的优先级排序，并决定在月底前完成原型设计。团队对资源分配方案达成初步共识，将在下次会议中细化执行计划。',
  '会议重点讨论了客户需求变更，团队评估了技术实现难度和工期影响。最终决定在保持原有排期的前提下，分阶段实施新需求，优先完成核心功能。',
  '本周工作进展顺利，各模块均按计划推进。识别到两个潜在风险点：第三方接口不稳定和测试环境资源不足。已安排专人跟进，并制定应急预案。',
  '会议对 Q2 季度目标完成情况进行复盘，整体进度达到预期。部分功能因技术难度超预期需要延期，已调整资源分配方案确保核心功能按期交付。',
]

const MOCK_DECISIONS = [
  [
    { content: '用户反馈分析功能优先级提升为 P0', decidedBy: 'user1' },
    { content: '数据看板功能推迟到 Q3', decidedBy: 'user2' },
    { content: '原型设计使用 Figma，5/31 前完成', decidedBy: 'user1' },
  ],
  [
    { content: '新需求分两期实施，一期在 6 月中旬完成', decidedBy: 'user2' },
    { content: '技术方案采用微服务架构', decidedBy: 'user3' },
  ],
  [
    { content: '风险点 A 由张三负责跟进，每日同步进展', decidedBy: 'user1' },
    { content: '申请增加测试服务器资源', decidedBy: 'user2' },
  ],
  [
    { content: 'Q2 核心功能延期一周，调整后续排期', decidedBy: 'user1' },
    { content: '增加两名开发人员支持关键模块', decidedBy: 'user2' },
  ],
]

const MOCK_CONTROVERSIES = [
  [
    { content: '是否需要支持移动端 — 未达成一致，下次会议继续讨论', relatedParticipants: ['user1', 'user2'] },
  ],
  [
    { content: '技术方案选型存在分歧，需要进一步调研', relatedParticipants: ['user2', 'user3'] },
  ],
  [
    { content: '排期优先级顺序有争议，待产品经理确认', relatedParticipants: ['user1', 'user3'] },
  ],
]

const SPEAKERS = ['张三', '李四', '王五', '赵六']

/**
 * 基于 meetingId 生成确定性 hash
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // 转换为 32 位整数
  }
  return Math.abs(hash)
}

/**
 * 生成模拟会议纪要
 */
export async function generateMinutes(meetingId: string): Promise<MeetingMinutes> {
  // 模拟延迟 1.5 秒
  await delay(1500)
  
  const hash = hashString(meetingId)
  const templateIndex = hash % MOCK_SUMMARIES.length
  
  const now = new Date()
  const meetingDuration = 3600 // 假设会议时长 1 小时
  
  // 生成关键决策
  const decisions: KeyDecision[] = MOCK_DECISIONS[templateIndex].map((d, i) => ({
    id: `decision-${i}-${Date.now()}`,
    content: d.content,
    decidedBy: d.decidedBy,
    timestamp: new Date(now.getTime() - Math.random() * meetingDuration * 1000),
  }))
  
  // 生成争议点
  const controversies: ControversyPoint[] = MOCK_CONTROVERSIES[templateIndex].map((c, i) => ({
    id: `controversy-${i}-${Date.now()}`,
    content: c.content,
    relatedParticipants: c.relatedParticipants,
    status: 'open' as const,
  }))
  
  // 生成转写片段（模拟）
  const transcripts: TranscriptSegment[] = []
  let currentTime = 0
  const segmentCount = 20 + Math.floor(Math.random() * 10)
  
  for (let i = 0; i < segmentCount; i++) {
    const speakerIndex = i % SPEAKERS.length
    const segmentDuration = 10 + Math.floor(Math.random() * 50)
    
    transcripts.push({
      id: `transcript-${i}-${Date.now()}`,
      speakerId: `user${speakerIndex + 1}`,
      speakerName: SPEAKERS[speakerIndex],
      text: `这是模拟的转写文本片段 ${i + 1}，实际场景中这里会是识别出的发言内容。`,
      startTime: currentTime,
      endTime: currentTime + segmentDuration,
      confidence: 0.85 + Math.random() * 0.15,
    })
    
    currentTime += segmentDuration + Math.floor(Math.random() * 5)
  }
  
  // 生成发言统计
  const speakingStats: SpeakingStat[] = SPEAKERS.map((name, i) => {
    const basePercentage = 20 + Math.random() * 15
    return {
      speakerId: `user${i + 1}`,
      speakerName: name,
      percentage: Math.round(basePercentage * 10) / 10,
      durationSeconds: Math.round(meetingDuration * basePercentage / 100),
    }
  })
  
  // 归一化百分比
  const totalPercentage = speakingStats.reduce((sum, s) => sum + s.percentage, 0)
  speakingStats.forEach(s => {
    s.percentage = Math.round((s.percentage / totalPercentage) * 1000) / 10
  })
  
  const minutes: MeetingMinutes = {
    id: `minutes-${Date.now()}`,
    meetingId,
    summary: MOCK_SUMMARIES[templateIndex],
    keyDecisions: decisions,
    controversies,
    transcripts,
    speakingStats,
    generatedAt: now,
    isEdited: false,
  }
  
  return minutes
}

/**
 * 模拟语音转写（未来可扩展）
 */
export async function transcribeAudio(_audioUrl: string): Promise<TranscriptSegment[]> {
  await delay(2000)
  // 返回空数组，实际由 generateMinutes 生成
  return []
}
