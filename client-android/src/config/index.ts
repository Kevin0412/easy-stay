/**
 * 应用配置文件
 */

// 获取 API 基础地址
export function getApiBaseUrl(): string {
  return process.env.TARO_APP_API_URL || 'http://localhost:3000'
}

// 导出配置
export default {
  getApiBaseUrl
}
