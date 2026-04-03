import React, { useCallback, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, Pressable, Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface ExpandableProps {
  className?: string
  children?: React.ReactNode
  maxHeight?: number
  expandLabel?: string
  collapseLabel?: string
  defaultExpanded?: boolean
}

function Expandable({
  className,
  children,
  maxHeight = 120,
  expandLabel = 'Show more',
  collapseLabel = 'Show less',
  defaultExpanded = false,
}: ExpandableProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [contentHeight, setContentHeight] = useState(0)
  const [measured, setMeasured] = useState(false)
  const animatedHeight = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current

  const needsToggle = measured && contentHeight > maxHeight

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const height = event.nativeEvent.layout.height
      if (!measured || Math.abs(height - contentHeight) > 1) {
        setContentHeight(height)
        setMeasured(true)
      }
    },
    [measured, contentHeight]
  )

  const toggle = useCallback(() => {
    const toValue = expanded ? 0 : 1
    setExpanded(!expanded)
    Animated.timing(animatedHeight, {
      toValue,
      duration: 250,
      useNativeDriver: false,
    }).start()
  }, [expanded, animatedHeight])

  const animatedStyle = needsToggle
    ? {
        maxHeight: animatedHeight.interpolate({
          inputRange: [0, 1],
          outputRange: [maxHeight, contentHeight],
        }),
      }
    : undefined

  const fadeOpacity = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  })

  return (
    <View className={cn('relative', className)}>
      <Animated.View style={[{ overflow: 'hidden' }, animatedStyle]}>
        <View onLayout={onLayout}>{children}</View>
      </Animated.View>

      {needsToggle && !expanded ? (
        <Animated.View
          style={{ opacity: fadeOpacity }}
          className="absolute bottom-0 left-0 right-0 h-12 bg-background/80"
          pointerEvents="none"
        />
      ) : null}

      {needsToggle ? (
        <Pressable onPress={toggle} className="items-center py-2 mt-1">
          <Text className="text-sm font-medium text-primary">
            {expanded ? collapseLabel : expandLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  )
}

export { Expandable }
export type { ExpandableProps }
