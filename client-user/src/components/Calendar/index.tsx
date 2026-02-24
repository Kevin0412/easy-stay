import { View, Text } from '@tarojs/components'
import React, { useState } from 'react'
import { useThemeStore } from '../../store/themeStore'
import './index.scss'

let RNModal: any = null
if (process.env.TARO_ENV === 'rn') {
  RNModal = require('react-native').Modal
}

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
  const d = theme === 'dark'
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
    if (dateStr === startDate || dateStr === endDate) return 'cal-day-selected'
    if (startDate && endDate && dateStr > startDate && dateStr < endDate) return 'cal-day-in-range'
    return 'cal-day'
  }

  const getDayTextClass = (dateStr: string) => {
    if (dateStr === startDate || dateStr === endDate) return 'cal-day-text-selected'
    if (startDate && endDate && dateStr > startDate && dateStr < endDate) return 'cal-day-text-in-range'
    if (dateStr < todayStr) return d ? 'cal-day-text-disabled-dark' : 'cal-day-text-disabled'
    if (dateStr === todayStr) return 'cal-day-text-today'
    return d ? 'cal-day-text-dark' : 'cal-day-text'
  }

  const days = daysInMonth(viewYear, viewMonth)
  const firstDay = firstDayOfMonth(viewYear, viewMonth)
  const cells: (string | null)[] = Array(firstDay).fill(null)
  for (let i = 1; i <= days; i++) cells.push(formatDate(viewYear, viewMonth, i))

  const nights = startDate && endDate
    ? Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)
    : 0

  const calendarContent = (
    <View className='calendar-overlay' onClick={onClose}>
      <View className={d ? 'calendar-panel-dark' : 'calendar-panel'} onClick={() => {}}>
        <View className='cal-header'>
          <View className='cal-nav' onClick={prevMonth}><Text className={d ? 'cal-nav-text-dark' : 'cal-nav-text'}>&lt;</Text></View>
          <Text className={d ? 'cal-title-dark' : 'cal-title'}>{viewYear}年{viewMonth}月</Text>
          <View className='cal-nav' onClick={nextMonth}><Text className={d ? 'cal-nav-text-dark' : 'cal-nav-text'}>&gt;</Text></View>
        </View>

        {startDate && (
          <View className={d ? 'cal-range-tip-dark' : 'cal-range-tip'}>
            <Text className={d ? 'cal-range-text-dark' : 'cal-range-text'}>{startDate || '入住'}</Text>
            {nights > 0 && <Text className='cal-nights'>{nights}晚</Text>}
            <Text className={d ? 'cal-range-text-dark' : 'cal-range-text'}>{endDate || '离店'}</Text>
          </View>
        )}

        <View className='cal-weekdays'>
          {['日','一','二','三','四','五','六'].map(w => <Text key={w} className='cal-weekday'>{w}</Text>)}
        </View>

        <View className='cal-grid'>
          {cells.map((dateStr, i) => (
            <View key={i} className={dateStr ? getDayClass(dateStr) : 'cal-day-empty'} onClick={() => dateStr && handleDayClick(dateStr)}>
              {dateStr && <Text className={getDayTextClass(dateStr)}>{parseInt(dateStr.split('-')[2])}</Text>}
            </View>
          ))}
        </View>

        <View className='cal-footer'>
          <View className={d ? 'cal-clear-dark' : 'cal-clear'} onClick={() => onChange('', '')}><Text className={d ? 'cal-clear-text-dark' : 'cal-clear-text'}>清除</Text></View>
          <View className='cal-close' onClick={onClose}><Text className='cal-close-text'>关闭</Text></View>
        </View>
      </View>
    </View>
  )

  if (RNModal) {
    return (
      <RNModal visible transparent animationType='slide' onRequestClose={onClose}>
        {calendarContent}
      </RNModal>
    )
  }

  return calendarContent
}
