/**
 * meeting-templates - 会议模板定义
 * 每个模板包含标题、描述、标签、预设议程
 */
import { MeetingTag } from '@/types'

export interface MeetingTemplate {
  id: string
  name: string
  description: string
  tags: MeetingTag[]
  durationMinutes: number
  /** 预设议题（不包含 id/order/isCompleted/createdAt，由创建页面填充） */
  presetAgenda: Array<{
    title: string
    description: string
    estimatedMinutes: number
    ownerId: string
  }>
}

export const MEETING_TEMPLATES: MeetingTemplate[] = [
  {
    id: 'tpl-weekly',
    name: '周会',
    description: '常规团队周会模板，包含工作汇报和本周计划',
    tags: ['周会'],
    durationMinutes: 60,
    presetAgenda: [
      { title: '上周工作回顾', description: '各成员汇报上周完成情况', estimatedMinutes: 20, ownerId: '' },
      { title: '本周计划', description: '确定本周工作任务和优先级', estimatedMinutes: 15, ownerId: '' },
      { title: '风险与阻塞', description: '讨论当前遇到的问题和需要的支持', estimatedMinutes: 10, ownerId: '' },
    ],
  },
  {
    id: 'tpl-review',
    name: '项目评审会',
    description: '项目进度评审，包含风险评估和下一步计划',
    tags: ['项目评审'],
    durationMinutes: 90,
    presetAgenda: [
      { title: '项目进度回顾', description: '回顾当前迭代完成的功能和进度', estimatedMinutes: 15, ownerId: '' },
      { title: '功能优先级讨论', description: '确定各功能的开发优先级', estimatedMinutes: 20, ownerId: '' },
      { title: '资源分配', description: '讨论人力资源和预算分配方案', estimatedMinutes: 15, ownerId: '' },
      { title: '风险识别', description: '识别潜在风险并制定应对措施', estimatedMinutes: 15, ownerId: '' },
      { title: '下一步计划', description: '确定下一阶段的目标和关键里程碑', estimatedMinutes: 10, ownerId: '' },
    ],
  },
  {
    id: 'tpl-client',
    name: '客户沟通会',
    description: '客户需求和反馈收集会议模板',
    tags: ['客户沟通'],
    durationMinutes: 60,
    presetAgenda: [
      { title: '需求介绍', description: '客户介绍需求背景和目标', estimatedMinutes: 20, ownerId: '' },
      { title: '技术可行性讨论', description: '讨论技术实现方案和工期评估', estimatedMinutes: 20, ownerId: '' },
      { title: '后续步骤', description: '明确双方下一步行动和交付时间', estimatedMinutes: 10, ownerId: '' },
      { title: 'Q&A', description: '自由提问和交流', estimatedMinutes: 10, ownerId: '' },
    ],
  },
  {
    id: 'tpl-1v1',
    name: '1v1 面谈',
    description: '一对一面谈模板，适用于绩效沟通或个人成长',
    tags: ['1v1'],
    durationMinutes: 30,
    presetAgenda: [
      { title: '近期工作总结', description: '讨论近期工作表现和成长', estimatedMinutes: 15, ownerId: '' },
      { title: '反馈与建议', description: '双向反馈，讨论改进方向', estimatedMinutes: 15, ownerId: '' },
    ],
  },
]

/**
 * 根据 ID 查找模板
 */
export function getTemplateById(id: string): MeetingTemplate | undefined {
  return MEETING_TEMPLATES.find(t => t.id === id)
}
