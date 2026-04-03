import React from 'react'
import { View, Text } from 'react-native'
import { cn } from '@grit-ui/core'

interface ChartAreaProps {
  className?: string
  data?: { label: string; value: number }[]
  title?: string
  height?: number
}

/**
 * Placeholder area chart component.
 * For production use, integrate with react-native-svg or victory-native.
 */
function ChartArea({
  className,
  data = [],
  title = 'Area Chart',
  height = 200,
}: ChartAreaProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <View className={cn('rounded-lg border border-border bg-background p-4', className)}>
      <Text className="mb-3 text-sm font-medium text-foreground">{title}</Text>
      <View className="flex-row items-end gap-1" style={{ height }}>
        {data.map((item, i) => (
          <View key={i} className="flex-1 items-center">
            <View
              className="w-full rounded-t-sm bg-primary/30"
              style={{ height: (item.value / maxValue) * height * 0.85 }}
            />
            <Text className="mt-1 text-[10px] text-muted-foreground" numberOfLines={1}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
      {data.length === 0 && (
        <View className="items-center justify-center" style={{ height }}>
          <Text className="text-sm text-muted-foreground">No data — requires react-native-svg</Text>
        </View>
      )}
    </View>
  )
}

export { ChartArea }
export type { ChartAreaProps }
