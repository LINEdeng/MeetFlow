/**
 * Mock 数据 - 预置会议、行动项和用户数据
 */
import { storageService } from '@/services/storage.service'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import {
  Meeting,
  MeetingStatus,
  MeetingTag,
  ActionItem,
  ActionItemStatus,
  User,
  Participant,
} from '@/types'

// 模拟用户
export const MOCK_USERS: User[] = [
  {
    id: 'user1',
    name: '张三',
    email: 'zhangsan@example.com',
    avatarUrl: '',
    calendarIds: ['cal1'],
    notificationPrefs: {
      beforeMeeting: true,
      reminderMinutesBefore: 15,
      emailNotifications: true,
    },
  },
  {
    id: 'user2',
    name: '李四',
    email: 'lisi@example.com',
    avatarUrl: '',
    calendarIds: ['cal2'],
    notificationPrefs: {
      beforeMeeting: true,
      reminderMinutesBefore: 10,
      emailNotifications: false,
    },
  },
  {
    id: 'user3',
    name: '王五',
    email: 'wangwu@example.com',
    avatarUrl: '',
    calendarIds: [],
    notificationPrefs: {
      beforeMeeting: false,
      reminderMinutesBefore: 15,
      emailNotifications: true,
    },
  },
  {
    id: 'user4',
    name: '赵六',
    email: 'zhaoliu@example.com',
    avatarUrl: '',
    calendarIds: ['cal4'],
    notificationPrefs: {
      beforeMeeting: true,
      reminderMinutesBefore: 5,
      emailNotifications: true,
    },
  },
]

// 额外参会人（不是完整 User 对象）
const EXTRA_PARTICIPANTS: Participant[] = [
  { id: 'user5', name: '孙七', email: 'sunqi@example.com', avatarUrl: '' },
  { id: 'user6', name: '客户代表', email: 'client@example.com', avatarUrl: '' },
]

// 创建参会人辅助函数
function createParticipant(user: User): Participant {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  }
}

// 模拟会议数据
export const MOCK_MEETINGS: Meeting[] = [
  {
    id: 'meeting-001',
    title: '产品评审会',
    startTime: new Date('2026-05-17T14:00:00'),
    endTime: new Date('2026-05-17T15:00:00'),
    description: '评审 Q2 产品功能和优先级',
    participants: MOCK_USERS.slice(0, 4).map(createParticipant),
    tags: ['项目评审', 'Q2规划'] as MeetingTag[],
    status: 'completed' as MeetingStatus,
    agendaItems: [
      {
        id: 'agenda-001',
        title: 'Q2 路线图回顾',
        description: '回顾 Q2 计划的功能点',
        estimatedMinutes: 15,
        ownerId: 'user1',
        order: 0,
        isCompleted: true,
        createdAt: new Date('2026-05-16'),
      },
      {
        id: 'agenda-002',
        title: '功能优先级讨论',
        description: '确定各功能的开发优先级',
        estimatedMinutes: 20,
        ownerId: 'user2',
        order: 1,
        isCompleted: true,
        createdAt: new Date('2026-05-16'),
      },
      {
        id: 'agenda-003',
        title: '资源分配',
        description: '讨论人力资源分配方案',
        estimatedMinutes: 10,
        ownerId: 'user3',
        order: 2,
        isCompleted: false,
        createdAt: new Date('2026-05-16'),
      },
    ],
    actionItems: [],
    createdAt: new Date('2026-05-16'),
    updatedAt: new Date('2026-05-17'),
  },
  {
    id: 'meeting-002',
    title: '团队周会',
    startTime: new Date('2026-05-16T10:00:00'),
    endTime: new Date('2026-05-16T11:00:00'),
    description: '每周团队同步会议',
    participants: [
      ...MOCK_USERS.slice(0, 4).map(createParticipant),
      EXTRA_PARTICIPANTS[0],
    ],
    tags: ['周会'] as MeetingTag[],
    status: 'completed' as MeetingStatus,
    agendaItems: [
      {
        id: 'agenda-004',
        title: '上周工作回顾',
        description: '各成员汇报上周完成情况',
        estimatedMinutes: 20,
        ownerId: 'user1',
        order: 0,
        isCompleted: true,
        createdAt: new Date('2026-05-15'),
      },
      {
        id: 'agenda-005',
        title: '本周计划',
        description: '确定本周工作任务',
        estimatedMinutes: 20,
        ownerId: 'user1',
        order: 1,
        isCompleted: true,
        createdAt: new Date('2026-05-15'),
      },
    ],
    actionItems: [],
    createdAt: new Date('2026-05-15'),
    updatedAt: new Date('2026-05-16'),
  },
  {
    id: 'meeting-003',
    title: '客户需求沟通',
    startTime: new Date('2026-05-15T15:00:00'),
    endTime: new Date('2026-05-15T16:30:00'),
    description: '与客户讨论新需求',
    participants: [
      createParticipant(MOCK_USERS[0]),
      createParticipant(MOCK_USERS[2]),
      EXTRA_PARTICIPANTS[1],
    ],
    tags: ['客户沟通'] as MeetingTag[],
    status: 'completed' as MeetingStatus,
    agendaItems: [
      {
        id: 'agenda-006',
        title: '需求介绍',
        description: '客户介绍新需求背景',
        estimatedMinutes: 30,
        ownerId: 'user6',
        order: 0,
        isCompleted: true,
        createdAt: new Date('2026-05-14'),
      },
      {
        id: 'agenda-007',
        title: '技术方案讨论',
        description: '讨论技术可行性',
        estimatedMinutes: 40,
        ownerId: 'user2',
        order: 1,
        isCompleted: true,
        createdAt: new Date('2026-05-14'),
      },
    ],
    actionItems: [],
    createdAt: new Date('2026-05-14'),
    updatedAt: new Date('2026-05-15'),
  },
  {
    id: 'meeting-004',
    title: '1v1 with 李四',
    startTime: new Date('2026-05-14T14:00:00'),
    endTime: new Date('2026-05-14T14:30:00'),
    description: '个人成长沟通',
    participants: MOCK_USERS.slice(0, 2).map(createParticipant),
    tags: ['1v1'] as MeetingTag[],
    status: 'completed' as MeetingStatus,
    agendaItems: [
      {
        id: 'agenda-008',
        title: '近期工作总结',
        description: '讨论近期工作表现',
        estimatedMinutes: 15,
        ownerId: 'user1',
        order: 0,
        isCompleted: true,
        createdAt: new Date('2026-05-13'),
      },
    ],
    actionItems: [],
    createdAt: new Date('2026-05-13'),
    updatedAt: new Date('2026-05-14'),
  },
  {
    id: 'meeting-005',
    title: '需求评审会',
    startTime: new Date('2026-05-20T09:00:00'),
    endTime: new Date('2026-05-20T10:30:00'),
    description: '评审新版本需求文档',
    participants: MOCK_USERS.slice(0, 3).map(createParticipant),
    tags: ['需求评审'] as MeetingTag[],
    status: 'scheduled' as MeetingStatus,
    agendaItems: [
      {
        id: 'agenda-009',
        title: '需求文档评审',
        description: '逐条评审需求文档',
        estimatedMinutes: 45,
        ownerId: 'user1',
        order: 0,
        isCompleted: false,
        createdAt: new Date('2026-05-18'),
      },
    ],
    actionItems: [],
    createdAt: new Date('2026-05-18'),
    updatedAt: new Date('2026-05-18'),
  },
  {
    id: 'meeting-006',
    title: '头脑风暴 - 新功能创意',
    startTime: new Date('2026-05-22T14:00:00'),
    endTime: new Date('2026-05-22T15:30:00'),
    description: '集思广益讨论新功能点子',
    participants: MOCK_USERS.slice(0, 4).map(createParticipant),
    tags: ['头脑风暴'] as MeetingTag[],
    status: 'scheduled' as MeetingStatus,
    agendaItems: [
      {
        id: 'agenda-010',
        title: '创意收集',
        description: '自由发言，收集创意',
        estimatedMinutes: 30,
        ownerId: 'user1',
        order: 0,
        isCompleted: false,
        createdAt: new Date('2026-05-20'),
      },
      {
        id: 'agenda-011',
        title: '创意评选',
        description: '投票选出Top3创意',
        estimatedMinutes: 30,
        ownerId: 'user2',
        order: 1,
        isCompleted: false,
        createdAt: new Date('2026-05-20'),
      },
    ],
    actionItems: [],
    createdAt: new Date('2026-05-20'),
    updatedAt: new Date('2026-05-20'),
  },
]

// 模拟行动项数据
export const MOCK_ACTION_ITEMS: ActionItem[] = [
  {
    id: 'action-001',
    meetingId: 'meeting-001',
    description: '整理用户反馈报告',
    ownerId: 'user3',
    status: 'todo' as ActionItemStatus,
    dueDate: new Date('2026-05-17'),
    sourceMeetingTitle: '产品评审会',
    notes: '需要从客服系统导出最近一个月的反馈',
  },
  {
    id: 'action-002',
    meetingId: 'meeting-001',
    description: '更新项目排期',
    ownerId: 'user1',
    status: 'in-progress' as ActionItemStatus,
    dueDate: new Date('2026-05-22'),
    sourceMeetingTitle: '产品评审会',
    notes: '',
  },
  {
    id: 'action-003',
    meetingId: 'meeting-001',
    description: '确认设计稿',
    ownerId: 'user2',
    status: 'completed' as ActionItemStatus,
    dueDate: new Date('2026-05-16'),
    completedAt: new Date('2026-05-16'),
    sourceMeetingTitle: '产品评审会',
    notes: '设计稿已确认，开始开发',
  },
  {
    id: 'action-004',
    meetingId: 'meeting-001',
    description: '对接第三方 API',
    ownerId: 'user4',
    status: 'todo' as ActionItemStatus,
    dueDate: new Date('2026-05-23'),
    sourceMeetingTitle: '产品评审会',
    notes: '需要先申请 API 密钥',
  },
  {
    id: 'action-005',
    meetingId: 'meeting-002',
    description: '发送周报',
    ownerId: 'user3',
    status: 'completed' as ActionItemStatus,
    dueDate: new Date('2026-05-15'),
    completedAt: new Date('2026-05-15'),
    sourceMeetingTitle: '团队周会',
    notes: '',
  },
  {
    id: 'action-006',
    meetingId: 'meeting-003',
    description: '编写技术评估文档',
    ownerId: 'user2',
    status: 'completed' as ActionItemStatus,
    dueDate: new Date('2026-05-16'),
    completedAt: new Date('2026-05-16'),
    sourceMeetingTitle: '客户需求沟通',
    notes: '已发送给客户确认',
  },
]

// 初始化 Mock 数据到 localStorage
export function initializeMockData(): void {
  // 检查是否已初始化
  const existingMeetings = storageService.getItem<Meeting[]>(STORAGE_KEYS.MEETINGS)
  if (!existingMeetings || existingMeetings.length === 0) {
    // 为会议添加 actionItems 引用
    const meetingsWithActions = MOCK_MEETINGS.map((meeting) => {
      const meetingActionItems = MOCK_ACTION_ITEMS.filter(
        (item) => item.meetingId === meeting.id
      )
      return {
        ...meeting,
        actionItems: meetingActionItems,
      }
    })
    storageService.setItem(STORAGE_KEYS.MEETINGS, meetingsWithActions)
  }

  const existingActionItems = storageService.getItem<ActionItem[]>(STORAGE_KEYS.ACTION_ITEMS)
  if (!existingActionItems || existingActionItems.length === 0) {
    storageService.setItem(STORAGE_KEYS.ACTION_ITEMS, MOCK_ACTION_ITEMS)
  }
}
