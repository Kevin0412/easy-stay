import Taro from '@tarojs/taro'

// API 基础地址
const BASE_URL = 'http://localhost:3000'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: any
}

interface Response<T = any> {
  success: boolean
  data: T
  message: string
}

/**
 * 封装的请求方法
 */
export function request<T = any>(options: RequestOptions): Promise<Response<T>> {
  const { url, method = 'GET', data, header = {} } = options

  // 从本地存储获取 token
  const token = Taro.getStorageSync('token')
  if (token) {
    header.Authorization = `Bearer ${token}`
  }

  return new Promise((resolve, reject) => {
    Taro.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data as Response<T>)
        } else {
          Taro.showToast({
            title: '请求失败',
            icon: 'none'
          })
          reject(res.data)
        }
      },
      fail: (err) => {
        Taro.showToast({
          title: '网络错误',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

// GET 请求
export function get<T = any>(url: string, params?: any): Promise<Response<T>> {
  // 将参数拼接到URL中
  if (params) {
    const queryString = Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')
    if (queryString) {
      url = `${url}?${queryString}`
    }
  }
  return request<T>({ url, method: 'GET' })
}

// POST 请求
export function post<T = any>(url: string, data?: any): Promise<Response<T>> {
  return request<T>({ url, method: 'POST', data })
}

// PUT 请求
export function put<T = any>(url: string, data?: any): Promise<Response<T>> {
  return request<T>({ url, method: 'PUT', data })
}

// DELETE 请求
export function del<T = any>(url: string, data?: any): Promise<Response<T>> {
  return request<T>({ url, method: 'DELETE', data })
}
