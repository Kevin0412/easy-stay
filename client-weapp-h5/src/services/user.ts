import { get, post } from '../utils/request'

export interface User {
  id: number
  username: string
  email: string
  phone?: string
  created_at: string
}

export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams {
  username: string
  password: string
  email: string
  phone?: string
}

export function login(params: LoginParams) {
  return post<{ token: string; user: User }>('/api/auth/login/user', params)
}

export function register(params: RegisterParams) {
  return post<{ token: string; user: User }>('/api/auth/register', params)
}

export function getUserInfo() {
  return get<User>('/api/auth/me')
}
