import { PropsWithChildren, useEffect } from 'react'
import { useLaunch } from '@tarojs/taro'
import { useThemeStore } from './store/themeStore'
import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  const { theme, fontMode } = useThemeStore()

  useLaunch(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme)
      document.documentElement.setAttribute('data-font', fontMode)
    }
  })

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme)
      document.documentElement.setAttribute('data-font', fontMode)
    }
  }, [theme, fontMode])

  return children
}

export default App
