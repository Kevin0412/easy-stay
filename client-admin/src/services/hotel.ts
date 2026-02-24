import request, { ApiResponse } from '@/utils/request'

export type HotelStatus = 'draft' | 'pending' | 'published' | 'rejected' | 'offline'

export interface Hotel {
  id: number
  name_cn: string
  name_en: string
  address: string
  star: number
  open_date: string
  status: HotelStatus
  reject_reason: string | null
  cover_image: string | null
  images: string | null
  tags: string | null
  facilities: string | null
  nearby: string | null
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
  cover_image?: string
  images?: string
  tags?: string
  facilities?: string
  nearby?: string
}

/**
 * 获取酒店列表
 * @param {Object} params - 查询参数（status, star）
 * @returns {Promise} 酒店列表
 */
export function getHotels(params?: { status?: HotelStatus; star?: number }) {
  return request.get<ApiResponse<Hotel[]>>('/hotels', { params })
}

/**
 * 获取酒店详情
 * @param {number} id - 酒店 ID
 * @returns {Promise} 酒店详情
 */
export function getHotelById(id: number) {
  return request.get<ApiResponse<Hotel>>(`/hotels/${id}`)
}

/**
 * 创建酒店
 * @param {HotelFormData} data - 酒店表单数据
 * @returns {Promise} 新建酒店 ID
 */
export function createHotel(data: HotelFormData) {
  return request.post<ApiResponse<{ hotel_id: number }>>('/hotels', data)
}

/**
 * 更新酒店信息
 * @param {number} id - 酒店 ID
 * @param {HotelFormData} data - 酒店表单数据
 */
export function updateHotel(id: number, data: HotelFormData) {
  return request.put<ApiResponse<{}>>(`/hotels/${id}`, data)
}

/**
 * 删除酒店
 * @param {number} id - 酒店 ID
 */
export function deleteHotel(id: number) {
  return request.delete<ApiResponse<{}>>(`/hotels/${id}`)
}

/**
 * 提交酒店审核
 * @param {number} id - 酒店 ID
 */
export function publishHotel(id: number) {
  return request.post<ApiResponse<{}>>(`/hotels/${id}/publish`)
}

/**
 * 审核通过酒店
 * @param {number} id - 酒店 ID
 */
export function approveHotel(id: number) {
  return request.post<ApiResponse<{}>>(`/hotels/${id}/approve`)
}

/**
 * 审核拒绝酒店
 * @param {number} id - 酒店 ID
 * @param {string} reason - 拒绝原因
 */
export function rejectHotel(id: number, reason: string) {
  return request.post<ApiResponse<{}>>(`/hotels/${id}/reject`, { reason })
}

/**
 * 下线酒店
 * @param {number} id - 酒店 ID
 */
export function offlineHotel(id: number) {
  return request.post<ApiResponse<{}>>(`/hotels/${id}/offline`)
}

/**
 * 恢复上线酒店
 * @param {number} id - 酒店 ID
 */
export function restoreHotel(id: number) {
  return request.post<ApiResponse<{}>>(`/hotels/${id}/restore`)
}
