import React, { useState, useMemo, useCallback } from 'react'
import { View, Text, Pressable, Modal } from 'react-native'
import { cn } from '@grit-ui/core'

interface DateRange {
  start: Date | null
  end: Date | null
}

interface DatePickerRangeProps {
  className?: string
  value?: DateRange
  onChange?: (range: DateRange) => void
  placeholder?: string
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function fmt(date: Date | null): string {
  if (!date) return ''
  return MONTHS[date.getMonth()] + ' ' + date.getDate()
}

function sameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function inRange(day: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false
  return day > start && day < end
}

function DatePickerRange({
  className,
  value = { start: null, end: null },
  onChange,
  placeholder = 'Select date range',
}: DatePickerRangeProps) {
  const [visible, setVisible] = useState(false)
  const [viewDate, setViewDate] = useState(value.start || new Date())
  const [selecting, setSelecting] = useState<'start' | 'end'>('start')

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)
    return days
  }, [year, month])

  const handleSelect = useCallback(
    (day: number) => {
      const date = new Date(year, month, day)
      if (selecting === 'start') {
        onChange?.({ start: date, end: null })
        setSelecting('end')
      } else {
        const start = value.start
        if (start && date >= start) {
          onChange?.({ start, end: date })
          setSelecting('start')
          setVisible(false)
        } else {
          onChange?.({ start: date, end: null })
          setSelecting('end')
        }
      }
    },
    [year, month, selecting, value.start, onChange]
  )

  const displayText = value.start
    ? fmt(value.start) + (value.end ? ' - ' + fmt(value.end) : ' - ...')
    : placeholder

  return (
    <View className={cn(className)}>
      <Pressable
        onPress={() => setVisible(true)}
        className="h-10 flex-row items-center rounded-md border border-border bg-background px-3"
      >
        <Text className={cn('text-sm', value.start ? 'text-foreground' : 'text-muted-foreground')}>
          {displayText}
        </Text>
      </Pressable>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable className="flex-1 items-center justify-center bg-black/50" onPress={() => setVisible(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="w-80 rounded-xl bg-background p-4">
              <View className="mb-3 flex-row items-center justify-between">
                <Pressable onPress={() => setViewDate(new Date(year, month - 1, 1))} className="p-2">
                  <Text className="text-sm text-foreground">{'<'}</Text>
                </Pressable>
                <Text className="text-sm font-semibold text-foreground">
                  {MONTHS[month]} {year}
                </Text>
                <Pressable onPress={() => setViewDate(new Date(year, month + 1, 1))} className="p-2">
                  <Text className="text-sm text-foreground">{'>'}</Text>
                </Pressable>
              </View>

              <View className="mb-1 flex-row">
                {DAYS.map((d) => (
                  <View key={d} className="flex-1 items-center py-1">
                    <Text className="text-xs text-muted-foreground">{d}</Text>
                  </View>
                ))}
              </View>

              <View className="flex-row flex-wrap">
                {calendarDays.map((day, i) => {
                  if (!day) return <View key={i} className="w-[14.28%] h-8" />
                  const date = new Date(year, month, day)
                  const isStart = sameDay(date, value.start)
                  const isEnd = sameDay(date, value.end)
                  const isBetween = inRange(date, value.start, value.end)

                  return (
                    <View key={i} className="w-[14.28%] items-center py-0.5">
                      <Pressable
                        onPress={() => handleSelect(day)}
                        className={cn(
                          'h-8 w-8 items-center justify-center rounded-full',
                          (isStart || isEnd) && 'bg-primary',
                          isBetween && 'bg-primary/20'
                        )}
                      >
                        <Text
                          className={cn(
                            'text-sm',
                            isStart || isEnd ? 'text-primary-foreground font-medium' : 'text-foreground'
                          )}
                        >
                          {day}
                        </Text>
                      </Pressable>
                    </View>
                  )
                })}
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

export { DatePickerRange }
export type { DatePickerRangeProps, DateRange }
