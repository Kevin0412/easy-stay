import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Hotel } from '../../services/hotel'
import './index.scss'

interface HotelCardProps {
  hotel: Hotel
  checkIn?: string
  checkOut?: string
}

export default function HotelCard({ hotel, checkIn, checkOut }: HotelCardProps) {
  const handleClick = () => {
    let url = `/pages/detail/index?id=${hotel.id}`
    if (checkIn) url += `&checkIn=${checkIn}`
    if (checkOut) url += `&checkOut=${checkOut}`
    Taro.navigateTo({ url })
  }

  // 渲染星级
  const renderStars = () => {
    return '★'.repeat(hotel.star) + '☆'.repeat(5 - hotel.star)
  }

  return (
    <View className='hotel-card' onClick={handleClick}>
      <View className='hotel-card-image'>
        <Image
          className='image'
          src={hotel.cover_image || 'https://via.placeholder.com/300x200?text=Hotel'}
          mode='aspectFill'
        />
      </View>
      <View className='hotel-card-content'>
        <View className='hotel-name'>{hotel.name_cn}</View>
        <View className='hotel-name-en'>{hotel.name_en}</View>
        <View className='hotel-stars'>{renderStars()}</View>
        {hotel.rating && <View className='hotel-rating'>⭐ {hotel.rating.toFixed(1)}分</View>}
        <View className='hotel-address'>{hotel.address}</View>
        {hotel.discount && <View className='hotel-discount'>🎉 {hotel.discount}</View>}
        {hotel.min_price && (
          <View className='hotel-price'>¥{hotel.min_price} <Text className='price-unit'>起/晚</Text></View>
        )}
      </View>
    </View>
  )
}
