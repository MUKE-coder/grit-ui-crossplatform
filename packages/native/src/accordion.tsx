import React, { useRef, useState } from 'react'
import { Animated, LayoutAnimation, Platform, Pressable, Text, UIManager, View } from 'react-native'
import { cn } from '@grit-ui/core'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

interface AccordionItemProps {
  className?: string
  title: string
  children?: React.ReactNode
  defaultOpen?: boolean
  titleClassName?: string
}

function AccordionItem({
  className,
  title,
  children,
  defaultOpen = false,
  titleClassName,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen)
  const rotation = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current

  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    const next = !open
    setOpen(next)
    Animated.timing(rotation, {
      toValue: next ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  })

  return (
    <View className={cn('border-b border-border', className)}>
      <Pressable
        onPress={toggle}
        className="flex-row items-center justify-between py-4"
      >
        <Text className={cn('text-sm font-medium text-foreground flex-1', titleClassName)}>
          {title}
        </Text>
        <Animated.Text
          className="text-muted-foreground"
          // @ts-expect-error — NativeWind supports style alongside className
          style={{ transform: [{ rotate }] }}
        >
          ▼
        </Animated.Text>
      </Pressable>
      {open && <View className="pb-4">{children}</View>}
    </View>
  )
}

interface AccordionProps {
  className?: string
  children?: React.ReactNode
}

function Accordion({ className, children }: AccordionProps) {
  return <View className={className}>{children}</View>
}

export { Accordion, AccordionItem }
export type { AccordionProps, AccordionItemProps }
