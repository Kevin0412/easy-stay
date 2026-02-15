import { View, Text } from '@tarojs/components'
import React, { useState } from 'react'
import Taro, { useLoad, useReachBottom, usePullDownRefresh } from '@tarojs/taro'
import { getHotels, Hotel } from '../../services/hotel'
import HotelCard from '../../components/HotelCard'
import './index.scss'

export default function List() {
  const [allHotels, setAllHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [filterStar, setFilterStar] = useState<number | undefined>(undefined)

  // 加载酒店列表
  const loadHotels = async () => {
    if (loading) return

    setLoading(true)
    try {
      const res = await getHotels({ status: 'published' })
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
  const filteredHotels = filterStar
    ? allHotels.filter(hotel => hotel.star === filterStar)
    : allHotels

  // 页面加载时获取数据
  useLoad(() => {
    loadHotels()
  })

  // 下拉刷新
  usePullDownRefresh(() => {
    loadHotels().then(() => {
      Taro.stopPullDownRefresh()
    })
  })

  // 筛选星级
  const handleFilterStar = (star: number | undefined) => {
    setFilterStar(star)
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
        {filteredHotels.length === 0 && !loading && (
          <View className='empty-state'>
            <Text className='empty-text'>暂无酒店数据</Text>
          </View>
        )}

        {filteredHotels.map(hotel => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}

        {loading && (
          <View className='loading-state'>
            <Text className='loading-text'>加载中...</Text>
          </View>
        )}
      </View>
    </View>
  )
}
