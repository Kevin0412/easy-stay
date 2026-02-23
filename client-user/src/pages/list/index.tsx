import { View, Text, Input } from '@tarojs/components'
import React, { useState } from 'react'
import Taro, { useLoad, usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import { getHotels, Hotel } from '../../services/hotel'
import HotelCard from '../../components/HotelCard'
import FilterPanel from '../../components/FilterPanel'
import Calendar from '../../components/Calendar'
import { useThemeStore } from '../../store/themeStore'
import './index.scss'

export default function List() {
  const { theme } = useThemeStore()
  const [allHotels, setAllHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [filterStar, setFilterStar] = useState<number | undefined>(undefined)
  const [keyword, setKeyword] = useState('')
  const [city, setCity] = useState('')
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined)
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [sortMode, setSortMode] = useState<'default' | 'hot'>('default')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [showCalendar, setShowCalendar] = useState(false)

  const loadHotels = async (kw?: string, ct?: string, sort?: string, p = 1) => {
    if (loading) return
    setLoading(true)
    try {
      const res = await getHotels({ status: 'published', keyword: kw || keyword || undefined, city: ct || city || undefined, sort: sort, page: p, limit: 10 })
      if (res.success) {
        setAllHotels(p === 1 ? res.data : [...allHotels, ...res.data])
        setHasMore(res.data.length === 10)
        setPage(p)
      }
    } catch {
      Taro.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) loadHotels(keyword, city, sortMode === 'hot' ? 'hot' : undefined, page + 1)
  }

  const filteredHotels = allHotels.filter(hotel => {
    if (filterStar && hotel.star !== filterStar) return false
    if (keyword && !hotel.name_cn.includes(keyword) && !hotel.address.includes(keyword) && !(hotel.tags || '').includes(keyword)) return false
    if (minPrice !== undefined && hotel.min_price !== undefined && hotel.min_price < minPrice) return false
    if (maxPrice !== undefined && hotel.min_price !== undefined && hotel.min_price > maxPrice) return false
    return true
  })

  useLoad(() => {
    const instance = Taro.getCurrentInstance()
    const params = instance.router?.params || {}
    let kw = '', ct = ''
    if (params.star) setFilterStar(Number(params.star))
    if (params.keyword) { kw = decodeURIComponent(params.keyword); setKeyword(kw) }
    if (params.city) { ct = decodeURIComponent(params.city); setCity(ct) }
    if (params.minPrice) setMinPrice(Number(params.minPrice))
    if (params.maxPrice) setMaxPrice(Number(params.maxPrice))
    if (params.checkIn) setCheckInDate(params.checkIn)
    if (params.checkOut) setCheckOutDate(params.checkOut)
    loadHotels(kw, ct)
  })

  usePullDownRefresh(() => {
    setPage(1)
    loadHotels(keyword, city, sortMode === 'hot' ? 'hot' : undefined, 1).then(() => Taro.stopPullDownRefresh())
  })

  useReachBottom(() => {
    loadMore()
  })

  return (
    <View className={`list-container theme-${theme}`}>
      <View className='back-home-btn' onClick={() => Taro.switchTab({ url: '/pages/home/index' })}>
        <Text className='back-home-text'>← 返回首页</Text>
      </View>
      <View className='search-bar'>
        <Input className='search-input' placeholder='搜索城市/酒店' value={city} onInput={e => setCity(e.detail.value)} />
        <View className='search-btn' onClick={() => { setPage(1); loadHotels(keyword, city, sortMode === 'hot' ? 'hot' : undefined, 1) }}>搜索</View>
      </View>

      <View className='top-filter' onClick={() => setShowCalendar(true)}>
        <View className='top-filter-item'>
          <Text className='top-filter-label'>入住</Text>
          <Text className='top-filter-value'>{checkInDate || '选择日期'}</Text>
        </View>
        <View className='top-filter-divider'>
          {checkInDate && checkOutDate && checkInDate < checkOutDate
            ? <Text className='top-filter-nights'>{Math.round((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / 86400000)}晚</Text>
            : <Text className='top-filter-arrow'>→</Text>}
        </View>
        <View className='top-filter-item'>
          <Text className='top-filter-label'>离店</Text>
          <Text className='top-filter-value'>{checkOutDate || '选择日期'}</Text>
        </View>
      </View>

      {(city || keyword || filterStar || minPrice || maxPrice) && (
        <View className='filter-summary'>
          <Text className='summary-title'>当前筛选：</Text>
          <View className='summary-tags'>
            {city && <Text className='summary-tag' onClick={() => { setCity(''); loadHotels(keyword, '') }}>📍 {city} ✕</Text>}
            {keyword && <Text className='summary-tag'>关键词: {keyword}</Text>}
            {filterStar && <Text className='summary-tag'>星级: {filterStar}星</Text>}
            {minPrice !== undefined && <Text className='summary-tag'>最低: ¥{minPrice}</Text>}
            {maxPrice !== undefined && <Text className='summary-tag'>最高: ¥{maxPrice}</Text>}
          </View>
        </View>
      )}

      <FilterPanel
        filterStar={filterStar}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onStarChange={setFilterStar}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
      />

      <View className='sort-bar'>
        <Text
          className={`sort-item ${sortMode === 'default' ? 'active' : ''}`}
          onClick={() => { setSortMode('default'); loadHotels(keyword, city, undefined) }}
        >默认排序</Text>
        <Text
          className={`sort-item ${sortMode === 'hot' ? 'active' : ''}`}
          onClick={() => { setSortMode('hot'); loadHotels(keyword, city, 'hot') }}
        >🔥 热度排序</Text>
      </View>

      <View className='hotel-list'>
        {filteredHotels.length === 0 && !loading && (
          <View className='empty-state'><Text className='empty-text'>暂无酒店数据</Text></View>
        )}
        {filteredHotels.map(hotel => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
        {loading && <View className='loading-state'><Text className='loading-text'>加载中...</Text></View>}
        {!loading && !hasMore && filteredHotels.length > 0 && (
          <View className='no-more-state'><Text className='no-more-text'>没有更多了</Text></View>
        )}
      </View>

      {showCalendar && (
        <Calendar
          checkIn={checkInDate}
          checkOut={checkOutDate}
          onConfirm={(start, end) => {
            setCheckInDate(start)
            setCheckOutDate(end)
            setShowCalendar(false)
          }}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </View>
  )
}
