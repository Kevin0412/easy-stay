import request, { ApiResponse } from '@/utils/request'

export type HotelStatus = 'draft' | 'pending' | 'published' | 'offline'

export interface Hotel {
  id: number
  name_cn: string
  name_en: string
  address: string
  star: number
  open_date: string
  status: HotelStatus
  created_by: number
  created_at: string
  updated_at: string
}

export interface HotelFormData {
  name_cn: string
  name_en?: string
  address: string
  star: number
  open_date?: string
}

export function getHotels(params?: { status?: HotelStatus; star?: number }) {
  return request.get<ApiResponse<Hotel[]>>('/hotels', { params })
}

export function getHotelById(id: number) {
  return request.get<ApiResponse<Hotel>>(`/hotels/${id}`)
}

export function createHotel(data: HotelFormData) {
  return request.post<ApiResponse<{ hotel_id: number }>>('/hotels', data)
}

export function updateHotel(id: number, data: HotelFormData) {
  return request.put<ApiResponse<{}>>(`/hotels/${id}`, data)
}

export function deleteHotel(id: number) {
  return request.delete<ApiResponse<{}>>(`/hotels/${id}`)
}

export function publishHotel(id: number) {
  return request.post<ApiResponse<{}>>(`/hotels/${id}/publish`)
}

export function approveHotel(id: number) {
  return request.post<ApiResponse<{}>>(`/hotels/${id}/approve`)
}

export function offlineHotel(id: number) {
  return request.post<ApiResponse<{}>>(`/hotels/${id}/offline`)
}
