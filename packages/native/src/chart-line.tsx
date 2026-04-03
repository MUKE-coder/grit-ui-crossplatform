import React from 'react'
import { View, Text } from 'react-native'
import { cn } from '@grit-ui/core'

interface ChartLineProps {
  className?: string
  data?: { label: string; value: number }[]
  title?: string
  height?: number
}

/**
 * Placeholder line chart component.
 * For production use, integrate with react-native-svg or victory-native.
 */
function ChartLine({
  className,
  data = [],
  title = 'Line Chart',
  height = 200,
}: ChartLineProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <View className={cn('rounded-lg border border-border bg-background p-4', className)}>
      <Text className="mb-3 text-sm font-medium text-foreground">{title}</Text>
      <View className="flex-row items-end gap-1" style={{ height }}>
        {data.map((item, i) => {
          const barHeight = (item.value / maxValue) * height * 0.85
          return (
            <View key={i} className="flex-1 items-center">
              <View className="items-center" style={{ height: height * 0.85 }}>
                <View style={{ flex: 1 }} />
                <View
                  className="h-2 w-2 rounded-full bg-primary"
                  style={{ marginBottom: barHeight - 8 }}
                />
              </View>
              <Text className="mt-1 text-[10px] text-muted-foreground" numberOfLines={1}>
                {item.label}
              </Text>
            </View>
          )
        })}
      </View>
      {data.length === 0 && (
        <View className="items-center justify-center" style={{ height }}>
          <Text className="text-sm text-muted-foreground">No data — requires react-native-svg</Text>
        </View>
      )}
    </View>
  )
}

export { ChartLine }
export type { ChartLineProps }
