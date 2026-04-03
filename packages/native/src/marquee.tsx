import React, { useEffect, useRef } from 'react'
import { View, Animated, useWindowDimensions } from 'react-native'
import { cn } from '@grit-ui/core'

interface MarqueeProps {
  className?: string
  children: React.ReactNode
  speed?: number
  direction?: 'left' | 'right'
  pauseOnPress?: boolean
}

function Marquee({
  className,
  children,
  speed = 50,
  direction = 'left',
}: MarqueeProps) {
  const translateX = useRef(new Animated.Value(0)).current
  const { width: screenWidth } = useWindowDimensions()
  const contentWidth = screenWidth * 2

  useEffect(() => {
    const startPos = direction === 'left' ? 0 : -contentWidth / 2
    const endPos = direction === 'left' ? -contentWidth / 2 : 0
    const duration = (contentWidth / speed) * 1000

    translateX.setValue(startPos)

    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: endPos,
        duration,
        useNativeDriver: true,
      })
    )

    animation.start()
    return () => animation.stop()
  }, [speed, direction, contentWidth, translateX])

  return (
    <View className={cn('overflow-hidden', className)}>
      <Animated.View
        className="flex-row"
        style={{ transform: [{ translateX }] }}
      >
        <View className="flex-row">{children}</View>
        <View className="flex-row">{children}</View>
      </Animated.View>
    </View>
  )
}

export { Marquee }
export type { MarqueeProps }
