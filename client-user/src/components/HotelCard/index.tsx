import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Hotel } from '../../services/hotel'
import { useThemeStore } from '../../store/themeStore'
import './index.scss'

interface HotelCardProps {
  hotel: Hotel
  checkIn?: string
  checkOut?: string
}

export default function HotelCard({ hotel, checkIn, checkOut }: HotelCardProps) {
  const { theme } = useThemeStore()
  const d = theme === 'dark'
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
    <View className={d ? 'hotel-card-dark' : 'hotel-card'} onClick={handleClick}>
      <View className='hotel-card-image'>
        <Image
          className='image'
          src={hotel.cover_image || 'https://via.placeholder.com/300x200?text=Hotel'}
          mode='aspectFill'
        />
      </View>
      <View className='hotel-card-content'>
        <Text className={d ? 'hotel-name-dark' : 'hotel-name'}>{hotel.name_cn}</Text>
        <Text className={d ? 'hotel-name-en-dark' : 'hotel-name-en'}>{hotel.name_en}</Text>
        <Text className='hotel-stars'>{renderStars()}</Text>
        {hotel.rating && <Text className='hotel-rating'>⭐ {hotel.rating.toFixed(1)}分</Text>}
        <Text className={d ? 'hotel-address-dark' : 'hotel-address'}>{hotel.address}</Text>
        {hotel.discount && <Text className={d ? 'hotel-discount-dark' : 'hotel-discount'}>🎉 {hotel.discount}</Text>}
        {hotel.min_price && (
          <Text className='hotel-price'>¥{hotel.min_price} <Text className='price-unit'>起/晚</Text></Text>
        )}
      </View>
    </View>
  )
}
