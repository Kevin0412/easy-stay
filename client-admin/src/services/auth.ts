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

export function login(params: LoginParams) {
  return request.post<ApiResponse<LoginResponse>>('/auth/login', params)
}

export function register(params: RegisterParams) {
  return request.post<ApiResponse<{ user_id: number }>>('/auth/register', params)
}
