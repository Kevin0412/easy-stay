/**
 * 应用配置文件
 */

// 开发环境的局域网 IP 地址
// 运行 `ip addr` 或 `ifconfig` 查看本机 IP
export const DEV_HOST = '192.168.43.177'

// API 端口
export const API_PORT = 3000

// 获取 API 基础地址
export function getApiBaseUrl(): string {
  // 开发环境
  if (process.env.NODE_ENV === 'development') {
    // H5 环境：尝试使用当前页面的 hostname
    if (process.env.TARO_ENV === 'h5' && typeof window !== 'undefined') {
      const hostname = window.location.hostname
      // 如果不是 localhost，使用当前 hostname
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return `http://${hostname}:${API_PORT}`
      }
    }
    // 其他环境或 localhost：使用配置的局域网 IP
    return `http://${DEV_HOST}:${API_PORT}`
  }

  // 生产环境：使用实际的服务器地址
  return 'https://your-production-api.com'
}

// 导出配置
export default {
  DEV_HOST,
  API_PORT,
  getApiBaseUrl
}
