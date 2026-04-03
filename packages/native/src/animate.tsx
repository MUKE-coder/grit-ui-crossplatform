import React, { useEffect, useRef } from 'react'
import { Animated, type ViewStyle } from 'react-native'
import { cn } from '@grit-ui/core'

type AnimationPreset = 'fadeIn' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'scaleOut' | 'bounce'

interface AnimateProps {
  className?: string
  children: React.ReactNode
  preset?: AnimationPreset
  duration?: number
  delay?: number
  style?: ViewStyle
}

function getAnimationConfig(
  preset: AnimationPreset,
  animValue: Animated.Value
): { initial: number; final: number; transform: Animated.AnimatedProps<any> } {
  const opacity = animValue
  switch (preset) {
    case 'fadeIn':
      return { initial: 0, final: 1, transform: { opacity } }
    case 'fadeOut':
      return { initial: 1, final: 0, transform: { opacity } }
    case 'slideUp':
      return {
        initial: 0,
        final: 1,
        transform: {
          opacity,
          transform: [{ translateY: animValue.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
        },
      }
    case 'slideDown':
      return {
        initial: 0,
        final: 1,
        transform: {
          opacity,
          transform: [{ translateY: animValue.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }],
        },
      }
    case 'slideLeft':
      return {
        initial: 0,
        final: 1,
        transform: {
          opacity,
          transform: [{ translateX: animValue.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
        },
      }
    case 'slideRight':
      return {
        initial: 0,
        final: 1,
        transform: {
          opacity,
          transform: [{ translateX: animValue.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }],
        },
      }
    case 'scaleIn':
      return {
        initial: 0,
        final: 1,
        transform: {
          opacity,
          transform: [{ scale: animValue.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
        },
      }
    case 'scaleOut':
      return {
        initial: 1,
        final: 0,
        transform: {
          opacity,
          transform: [{ scale: animValue.interpolate({ inputRange: [0, 1], outputRange: [1, 0.8] }) }],
        },
      }
    case 'bounce':
      return {
        initial: 0,
        final: 1,
        transform: {
          opacity,
          transform: [{ scale: animValue.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.3, 1.05, 1] }) }],
        },
      }
  }
}

function Animate({
  className,
  children,
  preset = 'fadeIn',
  duration = 300,
  delay = 0,
  style,
}: AnimateProps) {
  const animValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const config = getAnimationConfig(preset, animValue)
    animValue.setValue(config.initial)

    Animated.timing(animValue, {
      toValue: config.final,
      duration,
      delay,
      useNativeDriver: true,
    }).start()
  }, [preset, duration, delay, animValue])

  const config = getAnimationConfig(preset, animValue)

  return (
    <Animated.View className={cn(className)} style={[style, config.transform]}>
      {children}
    </Animated.View>
  )
}

export { Animate }
export type { AnimateProps, AnimationPreset }
