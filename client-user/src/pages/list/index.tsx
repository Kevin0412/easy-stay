import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function List() {
  useLoad(() => {
    console.log('List page loaded.')
  })

  return (
    <View className='list-container'>
      <Text className='title'>酒店列表</Text>
      <Text className='subtitle'>列表页开发中...</Text>
    </View>
  )
}
