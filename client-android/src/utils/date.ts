/** 解析后端返回的 UTC 日期，修正时区偏移为本地日期 YYYY-MM-DD */
export function parseDate(date: string): string {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
