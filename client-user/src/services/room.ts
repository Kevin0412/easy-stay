import { get } from '../utils/request'

// 房型数据类型
export interface Room {
  id: number
  hotel_id: number
  room_type: string
  price: number
  stock: number
  image?: string
  created_at: string
  updated_at: string
}

// 获取酒店的所有房型
export function getRoomsByHotelId(hotelId: number) {
  return get<Room[]>(`/api/rooms/hotel/${hotelId}`)
}

// 计算价格
export function calculatePrice(params: {
  room_id: number
  start_date: string
  end_date: string
}) {
  return get<{ total_price: number; original_price: number; discount: number; strategy_name: string | null }>('/api/prices/calculate', params)
}
