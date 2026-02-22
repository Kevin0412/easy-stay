import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { useUserStore } from '@/store/user-store'

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message: string
}

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000
})

// 请求拦截器：自动注入Token
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useUserStore.getState().token
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }
)

// 响应拦截器：统一错误处理
request.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    const is_login_page = window.location.pathname === '/login'

    if (error.response?.status === 401) {
      if (!is_login_page) {
        message.error('登录已过期，请重新登录')
        useUserStore.getState().clearUser()
        window.location.href = '/login'
      }
      // 登录页的401由登录组件自行处理
    } else if (error.response?.status === 403) {
      if (!is_login_page) {
        message.error('没有权限访问')
      }
      // 登录页的403由登录组件自行处理
    } else {
      message.error(error.response?.data?.message || '请求失败')
    }
    return Promise.reject(error)
  }
)

export default request
