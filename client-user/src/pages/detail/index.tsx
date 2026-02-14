import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Detail() {
  useLoad(() => {
    console.log('Detail page loaded.')
  })

  return (
    <View className='detail-container'>
      <Text className='title'>酒店详情</Text>
      <Text className='subtitle'>详情页开发中...</Text>
    </View>
  )
}
