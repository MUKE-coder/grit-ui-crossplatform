import React from 'react'
import { View, Text } from 'react-native'
import { cn } from '@grit-ui/core'

interface ChartPieProps {
  className?: string
  data?: { label: string; value: number; color?: string }[]
  title?: string
  size?: number
}

const defaultColors = ['#6c5ce7', '#00b894', '#fdcb6e', '#e17055', '#0984e3', '#d63031', '#00cec9', '#e84393']

/**
 * Placeholder pie chart component.
 * For production use, integrate with react-native-svg or victory-native.
 */
function ChartPie({
  className,
  data = [],
  title = 'Pie Chart',
  size = 160,
}: ChartPieProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1

  return (
    <View className={cn('rounded-lg border border-border bg-background p-4', className)}>
      <Text className="mb-3 text-sm font-medium text-foreground">{title}</Text>
      <View className="items-center">
        <View
          className="items-center justify-center rounded-full bg-muted"
          style={{ width: size, height: size }}
        >
          <Text className="text-sm text-muted-foreground">Pie Chart</Text>
          <Text className="text-xs text-muted-foreground">Requires SVG</Text>
        </View>
        <View className="mt-3 flex-row flex-wrap justify-center gap-3">
          {data.map((item, i) => (
            <View key={i} className="flex-row items-center gap-1.5">
              <View
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color || defaultColors[i % defaultColors.length] }}
              />
              <Text className="text-xs text-muted-foreground">
                {item.label} ({Math.round((item.value / total) * 100)}%)
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export { ChartPie }
export type { ChartPieProps }
