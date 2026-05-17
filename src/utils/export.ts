/**
 * export - 导出功能（Markdown/PDF）
 */
import { MeetingMinutes, Meeting, ActionItem } from '@/types'

/**
 * 导出会议数据为 Markdown 格式
 */
export function exportToMarkdown(
  meeting: Meeting,
  minutes?: MeetingMinutes
): string {
  let md = `# ${meeting.title}\n\n`
  
  // 会议信息
  md += `## 会议信息\n\n`
  md += `- **时间**: ${meeting.startTime.toLocaleString()} - ${meeting.endTime.toLocaleString()}\n`
  md += `- **参会人**: ${meeting.participants.map(p => p.name).join(', ')}\n`
  md += `- **描述**: ${meeting.description}\n\n`
  
  // 议题
  if (meeting.agendaItems.length > 0) {
    md += `## 议题列表\n\n`
    meeting.agendaItems.forEach((item, index) => {
      md += `${index + 1}. **${item.title}** (${item.estimatedMinutes}分钟)\n`
      if (item.description) {
        md += `   - ${item.description}\n`
      }
      md += `\n`
    })
  }
  
  // 会议纪要
  if (minutes) {
    md += `## 会议纪要\n\n`
    md += `### 摘要\n${minutes.summary}\n\n`
    
    if (minutes.keyDecisions.length > 0) {
      md += `### 关键决策\n\n`
      minutes.keyDecisions.forEach((decision, index) => {
        md += `${index + 1}. ${decision.content} (决策人: ${decision.decidedBy})\n`
      })
      md += `\n`
    }
    
    if (minutes.controversies.length > 0) {
      md += `### 争议点\n\n`
      minutes.controversies.forEach((controversy) => {
        md += `- ${controversy.content} (状态: ${controversy.status})\n`
      })
      md += `\n`
    }
  }
  
  // 行动项
  if (meeting.actionItems.length > 0) {
    md += `## 行动项\n\n`
    meeting.actionItems.forEach((item) => {
      md += `- [${item.status === 'completed' ? 'x' : ' '}] ${item.description} (负责人: ${item.ownerId})\n`
    })
  }
  
  return md
}

/**
 * 下载 Markdown 文件
 */
export function downloadMarkdown(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.md') ? filename : `${filename}.md`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 导出为 PDF（预留接口）
 */
export async function exportToPDF(
  elementId: string,
  filename: string
): Promise<void> {
  try {
    const html2canvas = (await import('html2canvas')).default
    const jsPDF = (await import('jspdf')).jsPDF
    
    const element = document.getElementById(elementId)
    if (!element) throw new Error('Element not found')
    
    const canvas = await html2canvas(element)
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF()
    const imgWidth = 210
    const pageHeight = 297
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    pdf.save(`${filename}.pdf`)
  } catch (error) {
    console.error('PDF 导出失败:', error)
    throw error
  }
}

/**
 * 导出单个行动项为 Markdown
 */
export function exportActionItemToMarkdown(item: ActionItem): string {
  let md = `# 行动项\n\n`
  md += `- **描述**: ${item.description}\n`
  md += `- **负责人**: ${item.ownerId}\n`
  md += `- **状态**: ${item.status}\n`
  if (item.dueDate) {
    md += `- **截止日期**: ${item.dueDate.toLocaleDateString()}\n`
  }
  if (item.notes) {
    md += `- **备注**: ${item.notes}\n`
  }
  return md
}
