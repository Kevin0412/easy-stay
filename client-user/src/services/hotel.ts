import { get, post, put, del } from '../utils/request'

// 酒店数据类型
export interface Hotel {
  id: number
  name_cn: string
  name_en: string
  address: string
  star: number
  open_date: string
  cover_image?: string
  images?: string
  status: string
  created_by: number
  created_at: string
  updated_at: string
  rooms?: Room[]
  min_price?: number
}

// 房型数据类型
export interface Room {
  id: number
  hotel_id: number
  room_type: string
  price: number
  stock: number
  created_at: string
  updated_at: string
}

// 获取酒店列表
export function getHotels(params?: { status?: string; star?: number }) {
  return get<Hotel[]>('/api/hotels', params)
}

// 获取酒店详情
export function getHotelById(id: number) {
  return get<Hotel>(`/api/hotels/${id}`)
}
