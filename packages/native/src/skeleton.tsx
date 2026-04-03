import React, { useEffect, useRef } from 'react'
import { Animated, type ViewProps } from 'react-native'
import { cn } from '@grit-ui/core'

interface SkeletonProps extends Omit<ViewProps, 'style'> {
  className?: string
  circle?: boolean
}

function Skeleton({ className, circle, ...props }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    )
    animation.start()
    return () => animation.stop()
  }, [opacity])

  return (
    <Animated.View
      className={cn(
        'bg-muted',
        circle ? 'rounded-full' : 'rounded-md',
        className
      )}
      // @ts-expect-error — NativeWind supports style alongside className
      style={{ opacity }}
      {...props}
    />
  )
}

export { Skeleton }
export type { SkeletonProps }
