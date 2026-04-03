import React, { useEffect, useRef } from 'react'
import { Animated, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface ProgressProps {
  className?: string
  value?: number
  max?: number
  indicatorClassName?: string
  animated?: boolean
}

function Progress({
  className,
  value = 0,
  max = 100,
  indicatorClassName,
  animated = true,
}: ProgressProps) {
  const widthAnim = useRef(new Animated.Value(0)).current
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)

  useEffect(() => {
    if (animated) {
      Animated.timing(widthAnim, {
        toValue: pct,
        duration: 300,
        useNativeDriver: false,
      }).start()
    } else {
      widthAnim.setValue(pct)
    }
  }, [pct, animated, widthAnim])

  return (
    <View className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}>
      <Animated.View
        className={cn('h-full rounded-full bg-primary', indicatorClassName)}
        // @ts-expect-error — NativeWind supports style alongside className
        style={{
          width: widthAnim.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }),
        }}
      />
    </View>
  )
}

export { Progress }
export type { ProgressProps }
