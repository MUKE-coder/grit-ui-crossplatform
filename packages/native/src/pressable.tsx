import React, { useCallback, useRef } from 'react'
import { Pressable as RNPressable, Animated, type PressableProps as RNPressableProps } from 'react-native'
import { cn } from '@grit-ui/core'

interface PressableProps extends Omit<RNPressableProps, 'style'> {
  className?: string
  pressedClassName?: string
  scaleOnPress?: number
  children: React.ReactNode
}

function Pressable({
  className,
  pressedClassName,
  scaleOnPress = 0.97,
  onPressIn,
  onPressOut,
  children,
  ...props
}: PressableProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = useCallback(
    (e: any) => {
      Animated.spring(scaleAnim, {
        toValue: scaleOnPress,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }).start()
      onPressIn?.(e)
    },
    [scaleAnim, scaleOnPress, onPressIn]
  )

  const handlePressOut = useCallback(
    (e: any) => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start()
      onPressOut?.(e)
    },
    [scaleAnim, onPressOut]
  )

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <RNPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={cn(className)}
        {...props}
      >
        {children}
      </RNPressable>
    </Animated.View>
  )
}

export { Pressable }
export type { PressableProps }
