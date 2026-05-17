/**
 * 生成唯一 ID
 * 使用浏览器原生的 crypto.randomUUID()
 */
export function generateId(): string {
  return crypto.randomUUID()
}
