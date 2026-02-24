import { View, Text } from '@tarojs/components'
import React, { useState } from 'react'
import { useThemeStore } from '../../store/themeStore'
import './index.scss'

interface CalendarProps {
  startDate: string
  endDate: string
  onChange: (start: string, end: string) => void
  onClose: () => void
}

function formatDate(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function parseDate(s: string): [number, number, number] {
  const [y, m, d] = s.split('-').map(Number)
  return [y, m, d]
}

function daysInMonth(y: number, m: number) {
  return new Date(y, m, 0).getDate()
}

function firstDayOfMonth(y: number, m: number) {
  return new Date(y, m - 1, 1).getDay()
}

export default function Calendar({ startDate, endDate, onChange, onClose }: CalendarProps) {
  const { theme } = useThemeStore()
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1)

  const todayStr = formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate())

  const prevMonth = () => {
    if (viewMonth === 1) { setViewYear(y => y - 1); setViewMonth(12) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 12) { setViewYear(y => y + 1); setViewMonth(1) }
    else setViewMonth(m => m + 1)
  }

  const handleDayClick = (dateStr: string) => {
    if (dateStr < todayStr) return
    if (!startDate || (startDate && endDate)) {
      onChange(dateStr, '')
    } else {
      if (dateStr <= startDate) {
        onChange(dateStr, '')
      } else {
        onChange(startDate, dateStr)
        onClose()
      }
    }
  }

  const getDayClass = (dateStr: string) => {
    const classes = ['cal-day']
    if (dateStr < todayStr) classes.push('disabled')
    if (dateStr === startDate || dateStr === endDate) classes.push('selected')
    if (startDate && endDate && dateStr > startDate && dateStr < endDate) classes.push('in-range')
    if (dateStr === todayStr) classes.push('today')
    return classes.join(' ')
  }

  const days = daysInMonth(viewYear, viewMonth)
  const firstDay = firstDayOfMonth(viewYear, viewMonth)
  const cells: (string | null)[] = Array(firstDay).fill(null)
  for (let d = 1; d <= days; d++) cells.push(formatDate(viewYear, viewMonth, d))

  const nights = startDate && endDate
    ? Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)
    : 0

  return (
    <View className='calendar-overlay' onClick={onClose}>
      <View className={`calendar-panel ${theme === 'dark' ? 'theme-dark' : ''}`} onClick={e => e.stopPropagation()}>
        <View className='cal-header'>
          <View className='cal-nav' onClick={prevMonth}>&lt;</View>
          <Text className='cal-title'>{viewYear}年{viewMonth}月</Text>
          <View className='cal-nav' onClick={nextMonth}>&gt;</View>
        </View>

        {startDate && (
          <View className='cal-range-tip'>
            <Text>{startDate || '入住'}</Text>
            {nights > 0 && <Text className='cal-nights'>{nights}晚</Text>}
            <Text>{endDate || '离店'}</Text>
          </View>
        )}

        <View className='cal-weekdays'>
          {['日','一','二','三','四','五','六'].map(w => <Text key={w} className='cal-weekday'>{w}</Text>)}
        </View>

        <View className='cal-grid'>
          {cells.map((dateStr, i) => (
            <View key={i} className={dateStr ? getDayClass(dateStr) : 'cal-day empty'} onClick={() => dateStr && handleDayClick(dateStr)}>
              {dateStr && <Text className='cal-day-text'>{parseInt(dateStr.split('-')[2])}</Text>}
            </View>
          ))}
        </View>

        <View className='cal-footer'>
          <View className='cal-clear' onClick={() => onChange('', '')}>清除</View>
          <View className='cal-close' onClick={onClose}>关闭</View>
        </View>
      </View>
    </View>
  )
}
