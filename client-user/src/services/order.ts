import { post, get } from '../utils/request'

export interface Order {
  id: number
  hotel_id: number
  room_id: number
  hotel_name: string
  room_type: string
  check_in: string
  check_out: string
  nights: number
  total_price: number
  status: string
  created_at: string
}

export function createOrder(data: {
  hotel_id: number
  room_id: number
  check_in: string
  check_out: string
  nights: number
  total_price: number
}) {
  return post<{ order_id: number }>('/api/orders', data)
}

export function getMyOrders() {
  return get<Order[]>('/api/orders')
}
