import request, { ApiResponse } from '@/utils/request'

export interface PriceStrategy {
  id: number
  hotel_id: number
  room_id: number | null
  strategy_name: string
  discount: number
  start_date: string
  end_date: string
  created_at: string
}

export interface PriceStrategyFormData {
  hotel_id: number
  room_id?: number | null
  strategy_name: string
  discount: number
  start_date: string
  end_date: string
}

export function getPriceStrategiesByHotelId(hotel_id: number) {
  return request.get<ApiResponse<PriceStrategy[]>>(`/prices/hotel/${hotel_id}`)
}

export function createPriceStrategy(data: PriceStrategyFormData) {
  return request.post<ApiResponse<{ strategy_id: number }>>('/prices', data)
}

export function updatePriceStrategy(id: number, data: Omit<PriceStrategyFormData, 'hotel_id' | 'room_id'>) {
  return request.put<ApiResponse<{}>>(`/prices/${id}`, data)
}

export function deletePriceStrategy(id: number) {
  return request.delete<ApiResponse<{}>>(`/prices/${id}`)
}
