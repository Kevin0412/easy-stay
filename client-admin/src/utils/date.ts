import dayjs from 'dayjs'

/** 解析后端返回的 UTC 日期，取纯日期部分避免时区偏移 */
export function parseDate(date: string) {
  return dayjs(String(date).slice(0, 10))
}
