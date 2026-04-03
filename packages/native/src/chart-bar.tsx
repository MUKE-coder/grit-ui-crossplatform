import React from 'react'
import { View, Text } from 'react-native'
import { cn } from '@grit-ui/core'

interface ChartBarProps {
  className?: string
  data?: { label: string; value: number }[]
  title?: string
  height?: number
  horizontal?: boolean
}

/**
 * Placeholder bar chart component.
 * For production use, integrate with react-native-svg or victory-native.
 */
function ChartBar({
  className,
  data = [],
  title = 'Bar Chart',
  height = 200,
  horizontal = false,
}: ChartBarProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  if (horizontal) {
    return (
      <View className={cn('rounded-lg border border-border bg-background p-4', className)}>
        <Text className="mb-3 text-sm font-medium text-foreground">{title}</Text>
        <View className="gap-2">
          {data.map((item, i) => (
            <View key={i} className="flex-row items-center gap-2">
              <Text className="w-16 text-xs text-muted-foreground" numberOfLines={1}>
                {item.label}
              </Text>
              <View className="h-6 flex-1 rounded-full bg-muted">
                <View
                  className="h-6 rounded-full bg-primary"
                  style={{ width: (item.value / maxValue) * 100 + '%' }}
                />
              </View>
              <Text className="w-8 text-right text-xs text-muted-foreground">{item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    )
  }

  return (
    <View className={cn('rounded-lg border border-border bg-background p-4', className)}>
      <Text className="mb-3 text-sm font-medium text-foreground">{title}</Text>
      <View className="flex-row items-end gap-2" style={{ height }}>
        {data.map((item, i) => (
          <View key={i} className="flex-1 items-center">
            <View
              className="w-full rounded-t-sm bg-primary"
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

export { ChartBar }
export type { ChartBarProps }
