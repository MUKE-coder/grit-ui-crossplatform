import React, { useEffect, useRef } from 'react'
import { View, Animated } from 'react-native'
import { cn } from '@grit-ui/core'

interface AnimateGroupProps {
  className?: string
  children: React.ReactNode
  staggerDelay?: number
  duration?: number
  preset?: 'fadeIn' | 'slideUp' | 'scaleIn'
}

function AnimateGroup({
  className,
  children,
  staggerDelay = 100,
  duration = 300,
  preset = 'fadeIn',
}: AnimateGroupProps) {
  const childArray = React.Children.toArray(children)
  const animValues = useRef(childArray.map(() => new Animated.Value(0))).current

  useEffect(() => {
    const animations = animValues.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration,
        delay: i * staggerDelay,
        useNativeDriver: true,
      })
    )
    Animated.parallel(animations).start()
  }, [animValues, duration, staggerDelay])

  const getStyle = (animValue: Animated.Value) => {
    switch (preset) {
      case 'slideUp':
        return {
          opacity: animValue,
          transform: [
            { translateY: animValue.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
          ],
        }
      case 'scaleIn':
        return {
          opacity: animValue,
          transform: [
            { scale: animValue.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
          ],
        }
      case 'fadeIn':
      default:
        return { opacity: animValue }
    }
  }

  return (
    <View className={cn(className)}>
      {childArray.map((child, i) => (
        <Animated.View key={i} style={getStyle(animValues[i])}>
          {child}
        </Animated.View>
      ))}
    </View>
  )
}

export { AnimateGroup }
export type { AnimateGroupProps }
