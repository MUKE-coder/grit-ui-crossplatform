import React from 'react'
import { View, Text } from 'react-native'
import { cn } from '@grit-ui/core'

interface ChartRadialProps {
  className?: string
  value?: number
  maxValue?: number
  title?: string
  label?: string
  size?: number
  color?: string
}

/**
 * Placeholder radial/gauge chart component.
 * For production use, integrate with react-native-svg or victory-native.
 */
function ChartRadial({
  className,
  value = 0,
  maxValue = 100,
  title = 'Radial Chart',
  label,
  size = 120,
  color = '#6c5ce7',
}: ChartRadialProps) {
  const percentage = Math.round((value / maxValue) * 100)

  return (
    <View className={cn('items-center rounded-lg border border-border bg-background p-4', className)}>
      {title && <Text className="mb-3 text-sm font-medium text-foreground">{title}</Text>}
      <View
        className="items-center justify-center rounded-full border-4 border-muted"
        style={{ width: size, height: size }}
      >
        <Text className="text-2xl font-bold text-foreground">{percentage}%</Text>
        {label && <Text className="text-xs text-muted-foreground">{label}</Text>}
      </View>
      <Text className="mt-2 text-xs text-muted-foreground">
        {value} / {maxValue}
      </Text>
    </View>
  )
}

export { ChartRadial }
export type { ChartRadialProps }
