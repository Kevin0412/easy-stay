import { View, Text, Input, Swiper, SwiperItem, Picker } from '@tarojs/components'
import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { getApiBaseUrl } from '../../config'
import './index.scss'

interface Hotel {
  id: number
  name_cn: string
  name_en?: string
  address: string
  star: number
  open_date?: string
  status: string
}

export default function Home() {
  const [keyword, setKeyword] = useState('')
  const [selectedStar, setSelectedStar] = useState<number | undefined>(undefined)
  const [carouselHotels, setCarouselHotels] = useState<Hotel[]>([])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)

  // 获取轮播图酒店
  useEffect(() => {
    fetchCarouselHotels()
  }, [])

  const fetchCarouselHotels = async () => {
    try {
      const baseUrl = getApiBaseUrl()
      const response = await Taro.request({
        url: `${baseUrl}/api/hotels/carousel`,
        method: 'GET'
      })

      if (response.data.success) {
        setCarouselHotels(response.data.data)
      }
    } catch (error) {
      console.error('获取轮播图失败:', error)
    }
  }

  // 搜索酒店
  const handleSearch = () => {
    const queryParams: string[] = []
    if (keyword.trim()) {
      queryParams.push(`keyword=${encodeURIComponent(keyword.trim())}`)
    }
    if (selectedStar) {
      queryParams.push(`star=${selectedStar}`)
    }
    if (minPrice.trim()) {
      queryParams.push(`minPrice=${minPrice}`)
    }
    if (maxPrice.trim()) {
      queryParams.push(`maxPrice=${maxPrice}`)
    }
    if (checkInDate) {
      queryParams.push(`checkIn=${checkInDate}`)
    }
    if (checkOutDate) {
      queryParams.push(`checkOut=${checkOutDate}`)
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : ''
    const targetUrl = `/pages/list/index${queryString}`

    console.log('准备跳转到:', targetUrl)

    // 跳转到列表页，传递筛选参数
    Taro.navigateTo({
      url: targetUrl
    })
  }

  // 选择日期
  const handleDateChange = (type: 'checkIn' | 'checkOut', e: any) => {
    const date = e.detail.value
    if (type === 'checkIn') {
      setCheckInDate(date)
    } else {
      setCheckOutDate(date)
    }
  }

  // 跳转到酒店详情
  const handleCarouselClick = (hotelId: number) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${hotelId}`
    })
  }

  // 选择星级
  const handleSelectStar = (star: number | undefined) => {
    setSelectedStar(star)
  }

  return (
    <View className='home-container'>
      {/* 轮播图区域 */}
      {carouselHotels.length > 0 && (
        <View className='carousel-section'>
          <Swiper
            className='carousel-swiper'
            indicatorColor='rgba(255, 255, 255, 0.5)'
            indicatorActiveColor='#fff'
            circular
            autoplay
            interval={3000}
            indicatorDots
          >
            {carouselHotels.map(hotel => (
              <SwiperItem key={hotel.id} onClick={() => handleCarouselClick(hotel.id)}>
                <View className='carousel-item'>
                  <View className='carousel-content'>
                    <Text className='carousel-title'>{hotel.name_cn}</Text>
                    <Text className='carousel-subtitle'>{hotel.address}</Text>
                    <View className='carousel-star'>
                      {'★'.repeat(hotel.star)}
                    </View>
                  </View>
                </View>
              </SwiperItem>
            ))}
          </Swiper>
        </View>
      )}

      {/* Banner 标题 */}
      <View className='banner'>
        <Text className='banner-title'>易宿酒店预订平台</Text>
        <Text className='banner-subtitle'>为您找到理想的住宿</Text>
      </View>

      {/* 搜索区域 */}
      <View className='search-section'>
        <View className='search-box'>
          <Input
            className='search-input'
            placeholder='搜索酒店名称或地址'
            value={keyword}
            onInput={(e) => setKeyword(e.detail.value)}
          />
        </View>

        {/* 星级筛选 */}
        <View className='filter-section'>
          <Text className='filter-label'>星级筛选：</Text>
          <View className='star-options'>
            <View
              className={`star-item ${selectedStar === undefined ? 'active' : ''}`}
              onClick={() => handleSelectStar(undefined)}
            >
              全部
            </View>
            {[5, 4, 3, 2, 1].map(star => (
              <View
                key={star}
                className={`star-item ${selectedStar === star ? 'active' : ''}`}
                onClick={() => handleSelectStar(star)}
              >
                {star}星
              </View>
            ))}
          </View>
        </View>

        {/* 高级筛选切换 */}
        <View className='advanced-toggle' onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}>
          <Text className='toggle-text'>
            {showAdvancedFilter ? '收起高级筛选 ▲' : '展开高级筛选 ▼'}
          </Text>
        </View>

        {/* 高级筛选面板 */}
        {showAdvancedFilter && (
          <View className='advanced-filter'>
            {/* 价格范围 */}
            <View className='filter-row'>
              <Text className='filter-label'>价格范围：</Text>
              <View className='price-inputs'>
                <Input
                  className='price-input'
                  type='number'
                  placeholder='最低价'
                  value={minPrice}
                  onInput={(e) => setMinPrice(e.detail.value)}
                />
                <Text className='price-separator'>-</Text>
                <Input
                  className='price-input'
                  type='number'
                  placeholder='最高价'
                  value={maxPrice}
                  onInput={(e) => setMaxPrice(e.detail.value)}
                />
              </View>
            </View>

            {/* 日期选择 */}
            <View className='filter-row'>
              <Text className='filter-label'>入住日期：</Text>
              <Picker mode='date' value={checkInDate} onChange={(e) => handleDateChange('checkIn', e)}>
                <View className='date-picker'>
                  <Text className={checkInDate ? 'date-text' : 'date-placeholder'}>
                    {checkInDate || '选择入住日期'}
                  </Text>
                </View>
              </Picker>
            </View>

            <View className='filter-row'>
              <Text className='filter-label'>离店日期：</Text>
              <Picker mode='date' value={checkOutDate} onChange={(e) => handleDateChange('checkOut', e)}>
                <View className='date-picker'>
                  <Text className={checkOutDate ? 'date-text' : 'date-placeholder'}>
                    {checkOutDate || '选择离店日期'}
                  </Text>
                </View>
              </Picker>
            </View>
          </View>
        )}

        {/* 搜索按钮 */}
        <View className='search-btn' onClick={handleSearch}>
          <Text className='search-btn-text'>搜索酒店</Text>
        </View>
      </View>

      {/* 快捷入口 */}
      <View className='quick-section'>
        <Text className='section-title'>热门推荐</Text>
        <View className='quick-tags'>
          <View className='tag-item' onClick={() => {
            // 直接跳转，不依赖状态
            Taro.navigateTo({
              url: '/pages/list/index?star=5'
            })
          }}>
            五星酒店
          </View>
          <View className='tag-item' onClick={() => {
            // 直接跳转，不依赖状态
            Taro.navigateTo({
              url: '/pages/list/index?star=4'
            })
          }}>
            四星酒店
          </View>
          <View className='tag-item' onClick={() => {
            // 直接跳转到列表页，不带参数
            Taro.navigateTo({
              url: '/pages/list/index'
            })
          }}>
            查看全部
          </View>
        </View>
      </View>
    </View>
  )
}
