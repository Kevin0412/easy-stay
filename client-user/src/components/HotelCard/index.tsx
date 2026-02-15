import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Hotel } from '../../services/hotel'
import './index.scss'

interface HotelCardProps {
  hotel: Hotel
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${hotel.id}`
    })
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
          src='https://via.placeholder.com/300x200?text=Hotel'
          mode='aspectFill'
        />
      </View>
      <View className='hotel-card-content'>
        <View className='hotel-name'>{hotel.name_cn}</View>
        <View className='hotel-name-en'>{hotel.name_en}</View>
        <View className='hotel-stars'>{renderStars()}</View>
        <View className='hotel-address'>{hotel.address}</View>
      </View>
    </View>
  )
}
