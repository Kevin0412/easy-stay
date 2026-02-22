import { View, Text, Picker } from '@tarojs/components'
import React, { useState } from 'react'
import Taro, { useLoad, useReachBottom, usePullDownRefresh } from '@tarojs/taro'
import { getHotels, Hotel } from '../../services/hotel'
import HotelCard from '../../components/HotelCard'
import './index.scss'

export default function List() {
  const [allHotels, setAllHotels] = useState<Hotel[]>([])
  const [displayCount, setDisplayCount] = useState(8)
  const [loading, setLoading] = useState(false)
  const [filterStar, setFilterStar] = useState<number | undefined>(undefined)
  const [keyword, setKeyword] = useState('')
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined)
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')

  // 加载酒店列表
  const loadHotels = async (kw?: string) => {
    if (loading) return

    setLoading(true)
    try {
      const res = await getHotels({ status: 'published', keyword: kw || keyword || undefined })
      if (res.success) {
        setAllHotels(res.data)
      }
    } catch (error) {
      console.error('加载酒店列表失败:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  // 前端筛选酒店
  const filteredHotels = allHotels.filter(hotel => {
    if (filterStar && hotel.star !== filterStar) return false
    if (keyword && !hotel.name_cn.includes(keyword) && !hotel.address.includes(keyword)) return false
    if (minPrice !== undefined && hotel.min_price !== undefined && hotel.min_price < minPrice) return false
    if (maxPrice !== undefined && hotel.min_price !== undefined && hotel.min_price > maxPrice) return false
    return true
  })

  const displayedHotels = filteredHotels.slice(0, displayCount)
  const hasMore = displayCount < filteredHotels.length

  // 页面加载时获取数据和参数
  useLoad(() => {
    // 获取路由参数
    const instance = Taro.getCurrentInstance()
    const params = instance.router?.params || {}

    if (params.star) {
      setFilterStar(Number(params.star))
    }
    let kw = ''
    if (params.keyword) {
      kw = decodeURIComponent(params.keyword)
      setKeyword(kw)
    }
    if (params.minPrice) setMinPrice(Number(params.minPrice))
    if (params.maxPrice) setMaxPrice(Number(params.maxPrice))
    if (params.checkIn) setCheckInDate(params.checkIn)
    if (params.checkOut) setCheckOutDate(params.checkOut)

    loadHotels(kw)
  })

  // 下拉刷新
  usePullDownRefresh(() => {
    setDisplayCount(8)
    loadHotels().then(() => {
      Taro.stopPullDownRefresh()
    })
  })

  // 触底加载更多
  useReachBottom(() => {
    if (hasMore) setDisplayCount(prev => prev + 8)
  })

  // 筛选星级
  const handleFilterStar = (star: number | undefined) => {
    setFilterStar(star)
  }

  // 返回首页
  const handleBackHome = () => {
    Taro.navigateBack()
  }

  return (
    <View className='list-container'>
      {/* 返回首页按钮 */}
      <View className='back-home-btn' onClick={handleBackHome}>
        <Text className='back-home-text'>← 返回首页</Text>
      </View>

      {/* 顶部核心条件筛选 */}
      <View className='top-filter'>
        <Picker mode='date' value={checkInDate} onChange={(e) => setCheckInDate(e.detail.value)}>
          <View className='top-filter-item'>
            <Text className='top-filter-label'>入住</Text>
            <Text className='top-filter-value'>{checkInDate || '选择日期'}</Text>
          </View>
        </Picker>
        <View className='top-filter-divider'>
          {checkInDate && checkOutDate && checkInDate < checkOutDate
            ? <Text className='top-filter-nights'>{Math.round((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / 86400000)}晚</Text>
            : <Text className='top-filter-arrow'>→</Text>
          }
        </View>
        <Picker mode='date' value={checkOutDate} onChange={(e) => setCheckOutDate(e.detail.value)}>
          <View className='top-filter-item'>
            <Text className='top-filter-label'>离店</Text>
            <Text className='top-filter-value'>{checkOutDate || '选择日期'}</Text>
          </View>
        </Picker>
      </View>

      {/* 筛选条件展示 */}
      {(keyword || filterStar || minPrice || maxPrice || checkInDate || checkOutDate) && (
        <View className='filter-summary'>
          <Text className='summary-title'>当前筛选条件：</Text>
          <View className='summary-tags'>
            {keyword && <Text className='summary-tag'>关键词: {keyword}</Text>}
            {filterStar && <Text className='summary-tag'>星级: {filterStar}星</Text>}
            {minPrice && <Text className='summary-tag'>最低价: ¥{minPrice}</Text>}
            {maxPrice && <Text className='summary-tag'>最高价: ¥{maxPrice}</Text>}
            {checkInDate && <Text className='summary-tag'>入住: {checkInDate}</Text>}
            {checkOutDate && <Text className='summary-tag'>离店: {checkOutDate}</Text>}
          </View>
        </View>
      )}

      {/* 筛选栏 */}
      <View className='filter-bar'>
        <View className='filter-title'>星级筛选：</View>
        <View className='filter-options'>
          <View
            className={`filter-item ${filterStar === undefined ? 'active' : ''}`}
            onClick={() => handleFilterStar(undefined)}
          >
            全部
          </View>
          {[5, 4, 3, 2, 1].map(star => (
            <View
              key={star}
              className={`filter-item ${filterStar === star ? 'active' : ''}`}
              onClick={() => handleFilterStar(star)}
            >
              {star}星
            </View>
          ))}
        </View>
      </View>

      {/* 酒店列表 */}
      <View className='hotel-list'>
        {filteredHotels.length === 0 && !loading && (
          <View className='empty-state'>
            <Text className='empty-text'>暂无酒店数据</Text>
          </View>
        )}

        {displayedHotels.map(hotel => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}

        {loading && (
          <View className='loading-state'>
            <Text className='loading-text'>加载中...</Text>
          </View>
        )}

        {!loading && hasMore && (
          <View className='load-more'>
            <Text className='load-more-text'>上滑加载更多</Text>
          </View>
        )}

        {!loading && !hasMore && filteredHotels.length > 0 && (
          <View className='no-more'>
            <Text className='no-more-text'>已显示全部酒店</Text>
          </View>
        )}
      </View>
    </View>
  )
}
