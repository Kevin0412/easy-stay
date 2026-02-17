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
  const [keyword, setKeyword] = useState('')
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined)
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')

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
  const filteredHotels = allHotels.filter(hotel => {
    // 星级筛选
    if (filterStar && hotel.star !== filterStar) {
      return false
    }
    // 关键词筛选
    if (keyword && !hotel.name_cn.includes(keyword) && !hotel.address.includes(keyword)) {
      return false
    }
    // 价格筛选 (需要从房型中获取最低价格)
    // 注意: 这里假设 hotel 对象包含 rooms 数组，如果没有则跳过价格筛选
    if ((minPrice !== undefined || maxPrice !== undefined) && hotel.rooms && hotel.rooms.length > 0) {
      const hotelMinPrice = Math.min(...hotel.rooms.map(room => room.price))
      if (minPrice !== undefined && hotelMinPrice < minPrice) {
        return false
      }
      if (maxPrice !== undefined && hotelMinPrice > maxPrice) {
        return false
      }
    }
    return true
  })

  // 页面加载时获取数据和参数
  useLoad(() => {
    // 获取路由参数
    const instance = Taro.getCurrentInstance()
    const params = instance.router?.params || {}

    console.log('接收到的路由参数:', params)

    if (params.star) {
      const starValue = Number(params.star)
      console.log('设置星级筛选:', starValue)
      setFilterStar(starValue)
    }
    if (params.keyword) {
      // 解码 URL 编码的关键词
      const decodedKeyword = decodeURIComponent(params.keyword)
      console.log('设置关键词筛选:', decodedKeyword)
      setKeyword(decodedKeyword)
    }
    if (params.minPrice) {
      setMinPrice(Number(params.minPrice))
    }
    if (params.maxPrice) {
      setMaxPrice(Number(params.maxPrice))
    }
    if (params.checkIn) {
      setCheckInDate(params.checkIn)
    }
    if (params.checkOut) {
      setCheckOutDate(params.checkOut)
    }

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
