import { View, Text, Input } from '@tarojs/components'
import React from 'react'
import { useThemeStore } from '../../store/themeStore'
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
  const { theme } = useThemeStore()
  const d = theme === 'dark'
  return (
    <View className={d ? 'filter-panel-dark' : 'filter-panel'}>
      <View className='fp-row'>
        <Text className={d ? 'fp-label-dark' : 'fp-label'}>星级</Text>
        <View className='fp-options'>
          {[undefined, 5, 4, 3, 2, 1].map(s => (
            <View key={String(s)} className={filterStar === s ? 'fp-item-active' : d ? 'fp-item-dark' : 'fp-item'} onClick={() => onStarChange(s)}>
              <Text className={filterStar === s ? 'fp-item-text-active' : d ? 'fp-item-text-dark' : 'fp-item-text'}>{s === undefined ? '全部' : `${s}星`}</Text>
            </View>
          ))}
        </View>
      </View>
      <View className='fp-row'>
        <Text className={d ? 'fp-label-dark' : 'fp-label'}>价格</Text>
        <View className='fp-price'>
          <Input className={d ? 'fp-price-input-dark' : 'fp-price-input'} type='number' placeholder='最低' placeholderStyle={d ? 'color: #666' : ''} value={minPrice !== undefined ? String(minPrice) : ''} onInput={e => onMinPriceChange(e.detail.value ? Number(e.detail.value) : undefined)} />
          <Text className={d ? 'fp-sep-dark' : 'fp-sep'}>-</Text>
          <Input className={d ? 'fp-price-input-dark' : 'fp-price-input'} type='number' placeholder='最高' placeholderStyle={d ? 'color: #666' : ''} value={maxPrice !== undefined ? String(maxPrice) : ''} onInput={e => onMaxPriceChange(e.detail.value ? Number(e.detail.value) : undefined)} />
        </View>
      </View>
    </View>
  )
}
