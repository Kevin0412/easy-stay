import { View, Text } from '@tarojs/components'
import React, { useState, useEffect, useRef } from 'react'
import Taro, { useLoad, useReachBottom, usePullDownRefresh } from '@tarojs/taro'
import { getHotels, Hotel } from '../../services/hotel'
import HotelCard from '../../components/HotelCard'
import FilterPanel from '../../components/FilterPanel'
import './index.scss'

const ITEM_HEIGHT = 280
const BUFFER = 4

export default function List() {
  const [allHotels, setAllHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [filterStar, setFilterStar] = useState<number | undefined>(undefined)
  const [keyword, setKeyword] = useState('')
  const [city, setCity] = useState('')
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined)
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(800)
  const [sortMode, setSortMode] = useState<'default' | 'hot'>('default')

  const loadHotels = async (kw?: string, ct?: string, sort?: string) => {
    if (loading) return
    setLoading(true)
    try {
      const res = await getHotels({ status: 'published', keyword: kw || keyword || undefined, city: ct || city || undefined, sort: sort })
      if (res.success) setAllHotels(res.data)
    } catch {
      Taro.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const filteredHotels = allHotels.filter(hotel => {
    if (filterStar && hotel.star !== filterStar) return false
    if (keyword && !hotel.name_cn.includes(keyword) && !hotel.address.includes(keyword) && !(hotel.tags || '').includes(keyword)) return false
    if (minPrice !== undefined && hotel.min_price !== undefined && hotel.min_price < minPrice) return false
    if (maxPrice !== undefined && hotel.min_price !== undefined && hotel.min_price > maxPrice) return false
    return true
  })

  // 虚拟列表：只渲染可视区域内的卡片
  const totalHeight = filteredHotels.length * ITEM_HEIGHT
  const startIdx = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER)
  const endIdx = Math.min(filteredHotels.length, Math.ceil((scrollTop + viewportHeight) / ITEM_HEIGHT) + BUFFER)
  const visibleHotels = filteredHotels.slice(startIdx, endIdx)
  const paddingTop = startIdx * ITEM_HEIGHT
  const paddingBottom = (filteredHotels.length - endIdx) * ITEM_HEIGHT

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
    if (typeof window !== 'undefined') setViewportHeight(window.innerHeight)
  })

  usePullDownRefresh(() => {
    loadHotels().then(() => Taro.stopPullDownRefresh())
  })

  useReachBottom(() => {})

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement
      setScrollTop(el.scrollTop || document.body.scrollTop)
      const { scrollHeight, clientHeight } = el
      if (scrollHeight - (el.scrollTop || document.body.scrollTop) - clientHeight < 100) {
        // virtual list handles rendering, no-op
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <View className='list-container'>
      <View className='back-home-btn' onClick={() => Taro.navigateTo({ url: '/pages/home/index' })}>
        <Text className='back-home-text'>← 返回首页</Text>
      </View>

      <View className='top-filter'>
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
        {loading && <View className='loading-state'><Text className='loading-text'>加载中...</Text></View>}

        {/* 虚拟列表容器 */}
        {filteredHotels.length > 0 && (
          <View style={{ height: `${totalHeight}px`, position: 'relative' }}>
            <View style={{ paddingTop: `${paddingTop}px`, paddingBottom: `${paddingBottom}px` }}>
              {visibleHotels.map(hotel => (
                <View key={hotel.id} style={{ height: `${ITEM_HEIGHT}px` }}>
                  <HotelCard hotel={hotel} />
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  )
}
