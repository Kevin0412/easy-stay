import request, { ApiResponse } from '@/utils/request'

export interface Room {
  id: number
  hotel_id: number
  room_type: string
  price: number
  stock: number
  max_guests: number
  image?: string
  created_at: string
  updated_at: string
}

export interface RoomFormData {
  hotel_id: number
  room_type: string
  price: number
  stock: number
  max_guests: number
  image?: string
}

export function getRoomsByHotelId(hotel_id: number) {
  return request.get<ApiResponse<Room[]>>(`/rooms/hotel/${hotel_id}`)
}

export function createRoom(data: RoomFormData) {
  return request.post<ApiResponse<{ room_id: number }>>('/rooms', data)
}

export function updateRoom(id: number, data: Partial<RoomFormData>) {
  return request.put<ApiResponse<{}>>(`/rooms/${id}`, data)
}

export function deleteRoom(id: number) {
  return request.delete<ApiResponse<{}>>(`/rooms/${id}`)
}
