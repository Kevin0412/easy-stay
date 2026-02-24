import { View, Text, Input, Swiper, SwiperItem, Picker, Image } from '@tarojs/components'
import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { getApiBaseUrl } from '../../config'
import Calendar from '../../components/Calendar'
import ThemeSwitcher from '../../components/ThemeSwitcher'
import { useThemeStore } from '../../store/themeStore'
import './index.scss'

interface Hotel {
  id: number
  name_cn: string
  address: string
  star: number
  cover_image?: string
  status: string
}

export default function Home() {
  const { theme } = useThemeStore()
  const d = theme === 'dark'
  const [keyword, setKeyword] = useState('')
  const [selectedStar, setSelectedStar] = useState<number | undefined>(undefined)
  const [carouselHotels, setCarouselHotels] = useState<Hotel[]>([])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [city, setCity] = useState('全国')

  const CITIES = ['全国', '北京市', '上海市', '广州市', '深圳市', '杭州市', '成都市', '南京市', '武汉市', '西安市', '重庆市', '苏州市', '厦门市', '青岛市', '长沙市']

  // 恢复上次搜索偏好 + 初始化
  useEffect(() => {
    Taro.getStorage({ key: 'last_search' }).then(res => {
      if (res.data) {
        const pref = JSON.parse(res.data as string)
        if (pref.keyword) setKeyword(pref.keyword)
        if (pref.selectedStar) setSelectedStar(pref.selectedStar)
        if (pref.minPrice) setMinPrice(pref.minPrice)
        if (pref.maxPrice) setMaxPrice(pref.maxPrice)
        if (pref.checkInDate) setCheckInDate(pref.checkInDate)
        if (pref.checkOutDate) setCheckOutDate(pref.checkOutDate)
      }
    }).catch(() => {})
    fetchCarouselHotels()
    getLocation()
  }, [])

  useEffect(() => {
    fetchCarouselHotels()
  }, [city])

  const fetchCarouselHotels = async () => {
    try {
      const baseUrl = getApiBaseUrl()
      const cityParam = city && city !== '全国' ? `?city=${encodeURIComponent(city.replace('市', ''))}` : ''
      const response = await Taro.request({
        url: `${baseUrl}/api/hotels/carousel${cityParam}`,
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
      fail: () => { setCity('全国'); Taro.showToast({ title: '定位失败，请手动选择', icon: 'none' }) }
    })
  }

  // 搜索酒店
  const handleSearch = () => {
    const queryParams: string[] = []
    if (keyword.trim()) {
      queryParams.push(`keyword=${encodeURIComponent(keyword.trim())}`)
    }
    if (city && city !== '全国') {
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

    // 缓存用户搜索偏好
    try {
      Taro.setStorage({ key: 'last_search', data: JSON.stringify({ keyword: keyword.trim(), selectedStar, minPrice, maxPrice, checkInDate, checkOutDate }) })
    } catch (e) {}

    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : ''
    Taro.navigateTo({ url: `/pages/list/index${queryString}` })
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
    <View className={d ? 'home-container-dark' : 'home-container'}>
      {/* 顶部导航 */}
      <View className='top-nav'>
        <Text className='nav-title'>易宿</Text>
        <View className='nav-right'>
          <ThemeSwitcher />
          <View className='nav-profile' onClick={() => Taro.navigateTo({ url: '/pages/profile/index' })}>
            <Text className='nav-profile-text'>我的</Text>
          </View>
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
                  <Image className='carousel-image' src={hotel.cover_image || ''} mode='aspectFill' />
                  <View className='carousel-content'>
                    <Text className='carousel-title'>{hotel.name_cn}</Text>
                    <Text className='carousel-subtitle'>{hotel.address}</Text>
                    <Text className='carousel-star'>{'★'.repeat(hotel.star)}</Text>
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
      <View className={d ? 'search-section-dark' : 'search-section'}>
        {/* 当前地点 */}
        <View className={d ? 'location-row-dark' : 'location-row'}>
          <Text className='location-icon'>📍</Text>
          <Picker
            mode='selector'
            range={CITIES}
            value={CITIES.indexOf(city)}
            onChange={(e) => setCity(CITIES[Number(e.detail.value)])}
          >
            <Text className={d ? 'location-text-dark' : 'location-text'}>{city || '选择城市'}</Text>
          </Picker>
          <Text className={d ? 'location-locate-dark' : 'location-locate'} onClick={getLocation}>定位</Text>
        </View>

        <View className='search-box'>
          <Input
            className={d ? 'search-input-dark' : 'search-input'}
            placeholder='搜索酒店名称或地址'
            placeholderStyle={d ? 'color: #666' : ''}
            value={keyword}
            onInput={(e) => setKeyword(e.detail.value)}
          />
        </View>

        {/* 日期选择 */}
        <View className={d ? 'date-row-dark' : 'date-row'} onClick={() => setShowCalendar(true)}>
          <View className='date-item'>
            <Text className={d ? 'date-item-label-dark' : 'date-item-label'}>入住</Text>
            <Text className={checkInDate ? (d ? 'date-item-value-dark' : 'date-item-value') : 'date-item-placeholder'}>{checkInDate || '选择日期'}</Text>
          </View>
          <View className='date-divider'>
            {checkInDate && checkOutDate && checkInDate < checkOutDate
              ? <Text className='nights-count'>{Math.round((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / 86400000)}晚</Text>
              : <Text className={d ? 'date-arrow-dark' : 'date-arrow'}>→</Text>}
          </View>
          <View className='date-item'>
            <Text className={d ? 'date-item-label-dark' : 'date-item-label'}>离店</Text>
            <Text className={checkOutDate ? (d ? 'date-item-value-dark' : 'date-item-value') : 'date-item-placeholder'}>{checkOutDate || '选择日期'}</Text>
          </View>
        </View>

        {/* 星级筛选 */}
        <View className='filter-section'>
          <Text className={d ? 'filter-label-dark' : 'filter-label'}>星级筛选：</Text>
          <View className='star-options'>
            <View
              className={selectedStar === undefined ? 'star-item-active' : (d ? 'star-item-dark' : 'star-item')}
              onClick={() => handleSelectStar(undefined)}
            >
              <Text className={d ? 'star-text-dark' : 'star-text'}>全部</Text>
            </View>
            {[5, 4, 3, 2, 1].map(star => (
              <View
                key={star}
                className={selectedStar === star ? 'star-item-active' : (d ? 'star-item-dark' : 'star-item')}
                onClick={() => handleSelectStar(star)}
              >
                <Text className={d ? 'star-text-dark' : 'star-text'}>{star}星</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 高级筛选切换 */}
        <View className={d ? 'advanced-toggle-dark' : 'advanced-toggle'} onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}>
          <Text className={d ? 'toggle-text-dark' : 'toggle-text'}>
            {showAdvancedFilter ? '收起价格筛选 ▲' : '展开价格筛选 ▼'}
          </Text>
        </View>

        {/* 高级筛选面板 */}
        {showAdvancedFilter && (
          <View className={d ? 'advanced-filter-dark' : 'advanced-filter'}>
            <View className='filter-row'>
              <Text className={d ? 'filter-label-dark' : 'filter-label'}>价格范围：</Text>
              <View className='price-inputs'>
                <Input
                  className={d ? 'price-input-dark' : 'price-input'}
                  type='number'
                  placeholder='最低价'
                  placeholderStyle={d ? 'color: #666' : ''}
                  value={minPrice}
                  onInput={(e) => setMinPrice(e.detail.value)}
                />
                <Text className={d ? 'price-separator-dark' : 'price-separator'}>-</Text>
                <Input
                  className={d ? 'price-input-dark' : 'price-input'}
                  type='number'
                  placeholder='最高价'
                  placeholderStyle={d ? 'color: #666' : ''}
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
      <View className={d ? 'quick-section-dark' : 'quick-section'}>
        <Text className={d ? 'section-title-dark' : 'section-title'}>快捷标签</Text>
        <View className='quick-tags'>
          {[
            { label: '五星酒店', params: 'star=5' },
            { label: '四星酒店', params: 'star=4' },
            { label: '豪华套房', params: 'keyword=套房' },
            { label: '亲子出行', params: 'keyword=亲子' },
            { label: '免费停车', params: 'keyword=停车' },
            { label: '查看全部', params: '' },
          ].map(tag => {
            const cityParam = city && city !== '全国' ? `city=${encodeURIComponent(city.replace('市', ''))}` : ''
            const query = [tag.params, cityParam].filter(Boolean).join('&')
            return (
              <View key={tag.label} className={d ? 'tag-item-dark' : 'tag-item'} onClick={() => Taro.navigateTo({ url: `/pages/list/index${query ? '?' + query : ''}` })}>
                <Text className={d ? 'tag-text-dark' : 'tag-text'}>{tag.label}</Text>
              </View>
            )
          })}
        </View>
      </View>

      {showCalendar && (
        <Calendar
          startDate={checkInDate}
          endDate={checkOutDate}
          onChange={(s, e) => { setCheckInDate(s); setCheckOutDate(e) }}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </View>
  )
}
