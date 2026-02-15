import { View, Text } from '@tarojs/components'
import React, { useState } from 'react'
import Taro, { useLoad, useReachBottom, usePullDownRefresh } from '@tarojs/taro'
import { getHotels, Hotel } from '../../services/hotel'
import HotelCard from '../../components/HotelCard'
import './index.scss'

export default function List() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [filterStar, setFilterStar] = useState<number | undefined>(undefined)

  // 加载酒店列表
  const loadHotels = async (isRefresh = false) => {
    if (loading) return

    setLoading(true)
    try {
      const params: any = { status: 'published' }
      if (filterStar) {
        params.star = filterStar
      }

      const res = await getHotels(params)
      if (res.success) {
        if (isRefresh) {
          setHotels(res.data)
        } else {
          setHotels([...hotels, ...res.data])
        }

        // 简单判断是否还有更多数据
        setHasMore(res.data.length > 0)
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

  // 页面加载时获取数据
  useLoad(() => {
    loadHotels(true)
  })

  // 下拉刷新
  usePullDownRefresh(() => {
    loadHotels(true).then(() => {
      Taro.stopPullDownRefresh()
    })
  })

  // 上拉加载更多
  useReachBottom(() => {
    if (hasMore && !loading) {
      loadHotels(false)
    }
  })

  // 筛选星级
  const handleFilterStar = (star: number | undefined) => {
    setFilterStar(star)
    setHotels([])
    // 延迟加载，确保状态更新
    setTimeout(() => {
      loadHotels(true)
    }, 100)
  }

  return (
    <View className='list-container'>
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
        {hotels.length === 0 && !loading && (
          <View className='empty-state'>
            <Text className='empty-text'>暂无酒店数据</Text>
          </View>
        )}

        {hotels.map(hotel => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}

        {loading && (
          <View className='loading-state'>
            <Text className='loading-text'>加载中...</Text>
          </View>
        )}

        {!hasMore && hotels.length > 0 && (
          <View className='no-more-state'>
            <Text className='no-more-text'>没有更多了</Text>
          </View>
        )}
      </View>
    </View>
  )
}
