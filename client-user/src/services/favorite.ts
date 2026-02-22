import { get, post, del } from '../utils/request'

export function getFavorites() {
  return get<any[]>('/api/favorites')
}

export function addFavorite(hotel_id: number) {
  return post('/api/favorites', { hotel_id })
}

export function removeFavorite(hotel_id: number) {
  return del(`/api/favorites/${hotel_id}`)
}

export function checkFavorite(hotel_id: number) {
  return get<boolean>(`/api/favorites/check/${hotel_id}`)
}
