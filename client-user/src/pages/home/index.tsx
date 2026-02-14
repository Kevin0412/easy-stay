import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Home() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='home-container'>
      <Text className='title'>易宿酒店预订平台</Text>
      <Text className='subtitle'>首页开发中...</Text>
    </View>
  )
}
