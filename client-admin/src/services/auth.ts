import request, { ApiResponse } from '@/utils/request'

export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams {
  username: string
  password: string
  role: 'admin' | 'merchant'
}

export interface User {
  id: number
  username: string
  role: 'admin' | 'merchant'
}

export interface LoginResponse {
  token: string
  user: User
}

/**
 * 管理端登录
 * @param {LoginParams} params - 用户名和密码
 * @returns {Promise} token 和用户信息
 */
export function login(params: LoginParams) {
  return request.post<ApiResponse<LoginResponse>>('/auth/login/admin', params)
}

/**
 * 注册新用户
 * @param {RegisterParams} params - 用户名、密码和角色
 * @returns {Promise} 新用户 ID
 */
export function register(params: RegisterParams) {
  return request.post<ApiResponse<{ user_id: number }>>('/auth/register', params)
}
