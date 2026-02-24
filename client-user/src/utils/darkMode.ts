import { useThemeStore } from '../store/themeStore'

/** Returns a className helper: d('foo') => 'foo' or 'foo-dark' based on theme */
export function useDark() {
  const dark = useThemeStore().theme === 'dark'
  return (cls: string) => dark ? `${cls}-dark` : cls
}
