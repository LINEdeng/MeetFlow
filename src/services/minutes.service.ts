/**
 * MinutesService - 会议纪要数据操作
 */
import { MeetingMinutes } from '@/types'
import { getMeetingById, saveMeetingMinutes } from './meeting.service'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取指定会议的纪要
 */
export async function getMinutesByMeetingId(
  meetingId: string
): Promise<MeetingMinutes | undefined> {
  await delay(100)
  const meeting = await getMeetingById(meetingId)
  // 返回 meeting.minutes，类型需要与 MeetingMinutes 兼容
  return meeting?.minutes as MeetingMinutes | undefined
}

/**
 * 保存会议纪要
 */
export async function saveMinutes(
  meetingId: string,
  minutes: MeetingMinutes
): Promise<MeetingMinutes> {
  await delay(200)
  await saveMeetingMinutes(meetingId, minutes as any)
  return minutes
}

/**
 * 删除会议纪要
 */
export async function deleteMinutes(meetingId: string): Promise<void> {
  await delay(200)
  await saveMeetingMinutes(meetingId, undefined)
}
