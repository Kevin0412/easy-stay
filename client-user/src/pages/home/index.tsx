import { View, Text, Input } from '@tarojs/components'
import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

export default function Home() {
  const [keyword, setKeyword] = useState('')
  const [selectedStar, setSelectedStar] = useState<number | undefined>(undefined)

  // 搜索酒店
  const handleSearch = () => {
    const queryParams: string[] = []
    if (keyword.trim()) {
      queryParams.push(`keyword=${encodeURIComponent(keyword.trim())}`)
    }
    if (selectedStar) {
      queryParams.push(`star=${selectedStar}`)
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : ''
    const targetUrl = `/pages/list/index${queryString}`

    console.log('准备跳转到:', targetUrl)
    console.log('关键词:', keyword)
    console.log('选中星级:', selectedStar)

    // 跳转到列表页，传递筛选参数
    Taro.navigateTo({
      url: targetUrl
    })
  }

  // 选择星级
  const handleSelectStar = (star: number | undefined) => {
    setSelectedStar(star)
  }

  return (
    <View className='home-container'>
      {/* Banner 区域 */}
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
