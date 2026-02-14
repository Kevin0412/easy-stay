import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Profile() {
  useLoad(() => {
    console.log('Profile page loaded.')
  })

  return (
    <View className='profile-container'>
      <Text className='title'>个人中心</Text>
      <Text className='subtitle'>个人中心开发中...</Text>
    </View>
  )
}
