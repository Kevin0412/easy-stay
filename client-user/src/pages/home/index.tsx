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
  const [city, setCity] = useState('')
  const [showCityPicker, setShowCityPicker] = useState(false)

  const CITIES = ['北京市', '上海市', '广州市', '深圳市', '杭州市', '成都市', '南京市', '武汉市', '西安市', '重庆市', '苏州市', '厦门市', '青岛市', '长沙市']

  // 获取轮播图酒店
  useEffect(() => {
    fetchCarouselHotels()
    getLocation()
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

  const getLocation = () => {
    Taro.getLocation({
      type: 'wgs84',
      success: (res) => {
        const { latitude, longitude } = res
        let cityName = ''
        if (latitude > 39.4 && latitude < 41.1 && longitude > 115.4 && longitude < 117.5) cityName = '北京市'
        else if (latitude > 30.6 && latitude < 31.9 && longitude > 120.8 && longitude < 122.2) cityName = '上海市'
        else if (latitude > 22.3 && latitude < 23.9 && longitude > 112.9 && longitude < 114.5) cityName = '广州市'
        else if (latitude > 22.4 && latitude < 22.9 && longitude > 113.7 && longitude < 114.6) cityName = '深圳市'
        else if (latitude > 29.9 && latitude < 30.6 && longitude > 119.9 && longitude < 120.7) cityName = '杭州市'
        else if (latitude > 30.4 && latitude < 31.0 && longitude > 103.7 && longitude < 104.5) cityName = '成都市'
        else if (latitude > 31.7 && latitude < 32.3 && longitude > 118.5 && longitude < 119.2) cityName = '南京市'
        else if (latitude > 30.3 && latitude < 31.0 && longitude > 113.7 && longitude < 114.7) cityName = '武汉市'
        else if (latitude > 33.9 && latitude < 34.5 && longitude > 108.7 && longitude < 109.3) cityName = '西安市'
        else if (latitude > 29.2 && latitude < 30.0 && longitude > 106.2 && longitude < 107.0) cityName = '重庆市'
        if (cityName) {
          setCity(cityName)
          Taro.showToast({ title: `已定位到${cityName}`, icon: 'success' })
        } else {
          Taro.showToast({ title: '未能识别城市，请手动选择', icon: 'none' })
        }
      },
      fail: () => Taro.showToast({ title: '定位失败，请手动选择', icon: 'none' })
    })
  }

  // 搜索酒店
  const handleSearch = () => {
    const queryParams: string[] = []
    if (keyword.trim()) {
      queryParams.push(`keyword=${encodeURIComponent(keyword.trim())}`)
    }
    if (city) {
      queryParams.push(`city=${encodeURIComponent(city.replace('市', ''))}`)
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
      {/* 顶部导航 */}
      <View className='top-nav'>
        <Text className='nav-title'>易宿</Text>
        <View className='nav-profile' onClick={() => Taro.navigateTo({ url: '/pages/profile/index' })}>
          <Text className='nav-profile-text'>我的</Text>
        </View>
      </View>

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
        {/* 当前地点 */}
        <View className='location-row'>
          <Text className='location-icon'>📍</Text>
          <Picker
            mode='selector'
            range={CITIES}
            value={CITIES.indexOf(city)}
            onChange={(e) => setCity(CITIES[Number(e.detail.value)])}
          >
            <Text className='location-text'>{city || '选择城市'}</Text>
          </Picker>
          <Text className='location-locate' onClick={getLocation}>定位</Text>
        </View>

        <View className='search-box'>
          <Input
            className='search-input'
            placeholder='搜索酒店名称或地址'
            value={keyword}
            onInput={(e) => setKeyword(e.detail.value)}
          />
        </View>

        {/* 日期选择 - 核心区域直接显示 */}
        <View className='date-row'>
          <Picker mode='date' value={checkInDate} onChange={(e) => handleDateChange('checkIn', e)}>
            <View className='date-item'>
              <Text className='date-item-label'>入住</Text>
              <Text className={checkInDate ? 'date-item-value' : 'date-item-placeholder'}>
                {checkInDate || '选择日期'}
              </Text>
            </View>
          </Picker>
          <View className='date-divider'>
            {checkInDate && checkOutDate && checkInDate < checkOutDate
              ? <Text className='nights-count'>{Math.round((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / 86400000)}晚</Text>
              : <Text className='date-arrow'>→</Text>
            }
          </View>
          <Picker mode='date' value={checkOutDate} onChange={(e) => handleDateChange('checkOut', e)}>
            <View className='date-item'>
              <Text className='date-item-label'>离店</Text>
              <Text className={checkOutDate ? 'date-item-value' : 'date-item-placeholder'}>
                {checkOutDate || '选择日期'}
              </Text>
            </View>
          </Picker>
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
            {showAdvancedFilter ? '收起价格筛选 ▲' : '展开价格筛选 ▼'}
          </Text>
        </View>

        {/* 高级筛选面板 */}
        {showAdvancedFilter && (
          <View className='advanced-filter'>
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
          </View>
        )}

        {/* 搜索按钮 */}
        <View className='search-btn' onClick={handleSearch}>
          <Text className='search-btn-text'>搜索酒店</Text>
        </View>
      </View>

      {/* 快捷标签 */}
      <View className='quick-section'>
        <Text className='section-title'>快捷标签</Text>
        <View className='quick-tags'>
          {[
            { label: '五星酒店', url: '/pages/list/index?star=5' },
            { label: '四星酒店', url: '/pages/list/index?star=4' },
            { label: '豪华套房', url: '/pages/list/index?keyword=套房' },
            { label: '亲子出行', url: '/pages/list/index?keyword=亲子' },
            { label: '免费停车', url: '/pages/list/index?keyword=停车' },
            { label: '查看全部', url: '/pages/list/index' },
          ].map(tag => (
            <View key={tag.label} className='tag-item' onClick={() => Taro.navigateTo({ url: tag.url })}>
              {tag.label}
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
