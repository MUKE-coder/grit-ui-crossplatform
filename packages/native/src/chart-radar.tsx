import React from 'react'
import { View, Text } from 'react-native'
import { cn } from '@grit-ui/core'

interface ChartRadarProps {
  className?: string
  data?: { label: string; value: number }[]
  title?: string
  size?: number
  maxValue?: number
}

/**
 * Placeholder radar chart component.
 * For production use, integrate with react-native-svg or victory-native.
 */
function ChartRadar({
  className,
  data = [],
  title = 'Radar Chart',
  size = 160,
  maxValue = 100,
}: ChartRadarProps) {
  return (
    <View className={cn('rounded-lg border border-border bg-background p-4', className)}>
      <Text className="mb-3 text-sm font-medium text-foreground">{title}</Text>
      <View className="items-center">
        <View
          className="items-center justify-center rounded-full bg-muted"
          style={{ width: size, height: size }}
        >
          <Text className="text-sm text-muted-foreground">Radar Chart</Text>
          <Text className="text-xs text-muted-foreground">Requires SVG</Text>
        </View>
        <View className="mt-3 gap-1">
          {data.map((item, i) => (
            <View key={i} className="flex-row items-center gap-2">
              <Text className="w-20 text-xs text-muted-foreground">{item.label}</Text>
              <View className="h-2 flex-1 rounded-full bg-muted">
                <View
                  className="h-2 rounded-full bg-primary"
                  style={{ width: (item.value / maxValue) * 100 + '%' }}
                />
              </View>
              <Text className="w-8 text-right text-xs text-muted-foreground">{item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export { ChartRadar }
export type { ChartRadarProps }
