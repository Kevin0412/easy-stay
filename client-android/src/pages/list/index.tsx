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
  const d = theme === 'dark'
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

  const TAG_OPTIONS = ['豪华套房', '免费停车', '亲子设施', '免费早餐', '江景/湖景', '健身中心', '商务中心', '无边泳池']
  const [filterTags, setFilterTags] = useState<string[]>([])

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
    if (filterTags.length > 0 && !filterTags.every(tag => (hotel.tags || '').includes(tag))) return false
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
    <View className={d ? 'list-container-dark' : 'list-container'}>
      <View className={d ? 'back-home-btn-dark' : 'back-home-btn'} onClick={() => Taro.reLaunch({ url: '/pages/home/index' })}>
        <Text className={d ? 'back-home-text-dark' : 'back-home-text'}>← 返回首页</Text>
      </View>
      <View className={d ? 'search-bar-dark' : 'search-bar'}>
        <Input className={d ? 'search-input-dark' : 'search-input'} placeholder='搜索城市/酒店' placeholderStyle={d ? 'color: #666' : ''} value={city} onInput={e => setCity(e.detail.value)} />
        <View className='search-btn' onClick={() => { setPage(1); loadHotels(keyword, city, sortMode === 'hot' ? 'hot' : undefined, 1) }}><Text className='search-btn-text'>搜索</Text></View>
      </View>

      <View className={d ? 'top-filter-dark' : 'top-filter'} onClick={() => setShowCalendar(true)}>
        <View className='top-filter-item'>
          <Text className={d ? 'top-filter-label-dark' : 'top-filter-label'}>入住</Text>
          <Text className={d ? 'top-filter-value-dark' : 'top-filter-value'}>{checkInDate || '选择日期'}</Text>
        </View>
        <View className='top-filter-divider'>
          {checkInDate && checkOutDate && checkInDate < checkOutDate
            ? <Text className='top-filter-nights'>{Math.round((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / 86400000)}晚</Text>
            : <Text className={d ? 'top-filter-arrow-dark' : 'top-filter-arrow'}>→</Text>}
        </View>
        <View className='top-filter-item'>
          <Text className={d ? 'top-filter-label-dark' : 'top-filter-label'}>离店</Text>
          <Text className={d ? 'top-filter-value-dark' : 'top-filter-value'}>{checkOutDate || '选择日期'}</Text>
        </View>
      </View>

      {(city || keyword || filterStar || minPrice || maxPrice) && (
        <View className={d ? 'filter-summary-dark' : 'filter-summary'}>
          <Text className={d ? 'summary-title-dark' : 'summary-title'}>当前筛选：</Text>
          <View className='summary-tags'>
            {city && <Text className={d ? 'summary-tag-dark' : 'summary-tag'} onClick={() => { setCity(''); loadHotels(keyword, '') }}>📍 {city} ✕</Text>}
            {keyword && <Text className={d ? 'summary-tag-dark' : 'summary-tag'}>关键词: {keyword}</Text>}
            {filterStar && <Text className={d ? 'summary-tag-dark' : 'summary-tag'}>星级: {filterStar}星</Text>}
            {minPrice !== undefined && <Text className={d ? 'summary-tag-dark' : 'summary-tag'}>最低: ¥{minPrice}</Text>}
            {maxPrice !== undefined && <Text className={d ? 'summary-tag-dark' : 'summary-tag'}>最高: ¥{maxPrice}</Text>}
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

      <View className={d ? 'tag-filter-dark' : 'tag-filter'}>
        {TAG_OPTIONS.map(tag => (
          <Text
            key={tag}
            className={filterTags.includes(tag) ? 'tag-chip-active' : (d ? 'tag-chip-dark' : 'tag-chip')}
            onClick={() => setFilterTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
          >{tag}</Text>
        ))}
      </View>

      <View className={d ? 'sort-bar-dark' : 'sort-bar'}>
        <Text
          className={sortMode === 'default' ? (d ? 'sort-item-active-dark' : 'sort-item-active') : (d ? 'sort-item-dark' : 'sort-item')}
          onClick={() => { setSortMode('default'); loadHotels(keyword, city, undefined) }}
        >默认排序</Text>
        <Text
          className={sortMode === 'hot' ? (d ? 'sort-item-active-dark' : 'sort-item-active') : (d ? 'sort-item-dark' : 'sort-item')}
          onClick={() => { setSortMode('hot'); loadHotels(keyword, city, 'hot') }}
        >🔥 热度排序</Text>
      </View>

      <View className='hotel-list'>
        {filteredHotels.length === 0 && !loading && (
          <View className='empty-state'><Text className={d ? 'empty-text-dark' : 'empty-text'}>暂无酒店数据</Text></View>
        )}
        {filteredHotels.map(hotel => (
          <HotelCard key={hotel.id} hotel={hotel} checkIn={checkInDate} checkOut={checkOutDate} />
        ))}
        {loading && <View className='loading-state'><Text className={d ? 'loading-text-dark' : 'loading-text'}>加载中...</Text></View>}
        {!loading && !hasMore && filteredHotels.length > 0 && (
          <View className='no-more-state'><Text className={d ? 'no-more-text-dark' : 'no-more-text'}>没有更多了</Text></View>
        )}
      </View>

      {showCalendar && (
        <Calendar
          startDate={checkInDate}
          endDate={checkOutDate}
          onChange={(start, end) => {
            setCheckInDate(start)
            setCheckOutDate(end)
          }}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </View>
  )
}
