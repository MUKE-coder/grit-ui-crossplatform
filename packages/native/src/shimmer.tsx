import React, { useEffect, useRef } from 'react'
import { View, Animated } from 'react-native'
import { cn } from '@grit-ui/core'

interface ShimmerProps {
  className?: string
  width?: number | string
  height?: number
  borderRadius?: number
}

function Shimmer({ className, width, height = 20, borderRadius = 6 }: ShimmerProps) {
  const animatedValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    )
    animation.start()
    return () => animation.stop()
  }, [animatedValue])

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  })

  return (
    <View className={cn(className)}>
      <Animated.View
        style={{
          width: width ?? '100%',
          height,
          borderRadius,
          opacity,
          backgroundColor: '#2a2a3a',
        }}
      />
    </View>
  )
}

interface ShimmerGroupProps {
  className?: string
  lines?: number
  lineHeight?: number
  gap?: number
}

function ShimmerGroup({ className, lines = 3, lineHeight = 16, gap = 8 }: ShimmerGroupProps) {
  return (
    <View className={cn(className)} style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer
          key={i}
          height={lineHeight}
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </View>
  )
}

export { Shimmer, ShimmerGroup }
export type { ShimmerProps, ShimmerGroupProps }
