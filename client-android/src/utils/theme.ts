import { useThemeStore } from '../store/themeStore'

// Dark mode colors matching the existing CSS dark styles
const dark = {
  bg: '#1a1a2e',
  card: '#16213e',
  cardAlt: '#0f3460',
  border: '#2a2a4a',
  text: '#e0e0e0',
  textSecondary: '#aaa',
  textMuted: '#666',
  link: '#7b93f5',
}

/** Returns inline style object for dark mode, or empty object for light */
export function useDarkStyle() {
  const isDark = useThemeStore().theme === 'dark'
  return (darkStyles: Record<string, string | number>) =>
    isDark ? darkStyles : {}
}

export { dark }
