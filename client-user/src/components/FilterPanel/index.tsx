import { View, Text, Input } from '@tarojs/components'
import React from 'react'
import './index.scss'

interface FilterPanelProps {
  filterStar: number | undefined
  minPrice: number | undefined
  maxPrice: number | undefined
  onStarChange: (star: number | undefined) => void
  onMinPriceChange: (v: number | undefined) => void
  onMaxPriceChange: (v: number | undefined) => void
}

export default function FilterPanel({ filterStar, minPrice, maxPrice, onStarChange, onMinPriceChange, onMaxPriceChange }: FilterPanelProps) {
  return (
    <View className='filter-panel'>
      <View className='fp-row'>
        <Text className='fp-label'>星级</Text>
        <View className='fp-options'>
          {[undefined, 5, 4, 3, 2, 1].map(s => (
            <View key={String(s)} className={`fp-item ${filterStar === s ? 'active' : ''}`} onClick={() => onStarChange(s)}>
              {s === undefined ? '全部' : `${s}星`}
            </View>
          ))}
        </View>
      </View>
      <View className='fp-row'>
        <Text className='fp-label'>价格</Text>
        <View className='fp-price'>
          <Input className='fp-price-input' type='number' placeholder='最低' value={minPrice !== undefined ? String(minPrice) : ''} onInput={e => onMinPriceChange(e.detail.value ? Number(e.detail.value) : undefined)} />
          <Text className='fp-sep'>-</Text>
          <Input className='fp-price-input' type='number' placeholder='最高' value={maxPrice !== undefined ? String(maxPrice) : ''} onInput={e => onMaxPriceChange(e.detail.value ? Number(e.detail.value) : undefined)} />
        </View>
      </View>
    </View>
  )
}
