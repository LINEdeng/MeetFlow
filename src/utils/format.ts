/**
 * format - 文本格式化工具函数
 */

/**
 * 截断文本
 * @param text 原始文本
 * @param maxLength 最大长度
 * @returns 截断后的文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 转换为 Markdown 格式
 * @param text 原始文本
 * @returns Markdown 格式文本
 */
export function toMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '**$1**')  // 粗体
    .replace(/\*(.*?)\*/g, '*$1*')        // 斜体
    .replace(/^# (.*$)/gm, '# $1')       // H1
    .replace(/^## (.*$)/gm, '## $1')     // H2
}

/**
 * 高亮关键词（返回 HTML 字符串）
 * @param text 原始文本
 * @param keyword 关键词
 * @returns 包含高亮标记的 HTML 字符串
 */
export function highlightKeywordHtml(text: string, keyword: string): string {
  if (!keyword.trim()) return text
  
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(
    new RegExp(`(${escapedKeyword})`, 'gi'),
    '<mark style="background-color: #ffe58f; padding: 0 2px;">$1</mark>'
  )
}
