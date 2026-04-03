import React, { useState, useMemo, useCallback } from 'react'
import { View, Text, Pressable, Modal, ScrollView } from 'react-native'
import { cn } from '@grit-ui/core'

interface DatePickerProps {
  className?: string
  value?: Date
  onChange?: (date: Date) => void
  placeholder?: string
  minDate?: Date
  maxDate?: Date
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDate(date: Date): string {
  return MONTHS[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()
}

function DatePicker({
  className,
  value,
  onChange,
  placeholder = 'Select date',
  minDate,
  maxDate,
}: DatePickerProps) {
  const [visible, setVisible] = useState(false)
  const [viewDate, setViewDate] = useState(value || new Date())

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

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const selectDay = useCallback(
    (day: number) => {
      const selected = new Date(year, month, day)
      if (minDate && selected < minDate) return
      if (maxDate && selected > maxDate) return
      onChange?.(selected)
      setVisible(false)
    },
    [year, month, onChange, minDate, maxDate]
  )

  const isSelected = (day: number) => {
    if (!value) return false
    return value.getFullYear() === year && value.getMonth() === month && value.getDate() === day
  }

  const isDisabled = (day: number) => {
    const d = new Date(year, month, day)
    if (minDate && d < minDate) return true
    if (maxDate && d > maxDate) return true
    return false
  }

  const isToday = (day: number) => {
    const now = new Date()
    return now.getFullYear() === year && now.getMonth() === month && now.getDate() === day
  }

  return (
    <View className={cn(className)}>
      <Pressable
        onPress={() => setVisible(true)}
        className="h-10 flex-row items-center rounded-md border border-border bg-background px-3"
      >
        <Text className={cn('text-sm', value ? 'text-foreground' : 'text-muted-foreground')}>
          {value ? formatDate(value) : placeholder}
        </Text>
      </Pressable>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable className="flex-1 items-center justify-center bg-black/50" onPress={() => setVisible(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="w-80 rounded-xl bg-background p-4">
              {/* Header */}
              <View className="mb-3 flex-row items-center justify-between">
                <Pressable onPress={prevMonth} className="rounded-md p-2">
                  <Text className="text-sm text-foreground">{'<'}</Text>
                </Pressable>
                <Text className="text-sm font-semibold text-foreground">
                  {MONTHS[month]} {year}
                </Text>
                <Pressable onPress={nextMonth} className="rounded-md p-2">
                  <Text className="text-sm text-foreground">{'>'}</Text>
                </Pressable>
              </View>

              {/* Day headers */}
              <View className="mb-1 flex-row">
                {DAYS.map((d) => (
                  <View key={d} className="flex-1 items-center py-1">
                    <Text className="text-xs text-muted-foreground">{d}</Text>
                  </View>
                ))}
              </View>

              {/* Calendar grid */}
              <View className="flex-row flex-wrap">
                {calendarDays.map((day, i) => (
                  <View key={i} className="w-[14.28%] items-center py-0.5">
                    {day ? (
                      <Pressable
                        onPress={() => selectDay(day)}
                        disabled={isDisabled(day)}
                        className={cn(
                          'h-8 w-8 items-center justify-center rounded-full',
                          isSelected(day) && 'bg-primary',
                          isToday(day) && !isSelected(day) && 'border border-primary',
                          isDisabled(day) && 'opacity-30'
                        )}
                      >
                        <Text
                          className={cn(
                            'text-sm',
                            isSelected(day) ? 'text-primary-foreground font-medium' : 'text-foreground'
                          )}
                        >
                          {day}
                        </Text>
                      </Pressable>
                    ) : (
                      <View className="h-8 w-8" />
                    )}
                  </View>
                ))}
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

export { DatePicker }
export type { DatePickerProps }
