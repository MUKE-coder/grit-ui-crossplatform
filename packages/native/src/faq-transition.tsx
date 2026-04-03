import React, { useState, useRef, useCallback } from 'react'
import { View, Text, Pressable, Animated, LayoutAnimation, Platform, UIManager } from 'react-native'
import { cn } from '@grit-ui/core'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

interface FAQItem {
  question: string
  answer: string
}

interface FAQTransitionProps {
  className?: string
  items: FAQItem[]
  allowMultiple?: boolean
}

function FAQTransition({ className, items, allowMultiple = false }: FAQTransitionProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set())

  const toggle = useCallback(
    (index: number) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setOpenIndices((prev) => {
        const next = new Set(allowMultiple ? prev : [])
        if (prev.has(index)) {
          next.delete(index)
        } else {
          next.add(index)
        }
        return next
      })
    },
    [allowMultiple]
  )

  return (
    <View className={cn('gap-2', className)}>
      {items.map((item, i) => {
        const isOpen = openIndices.has(i)
        return (
          <View key={i} className="rounded-lg border border-border bg-background">
            <Pressable
              onPress={() => toggle(i)}
              className="flex-row items-center justify-between px-4 py-3"
            >
              <Text className="flex-1 text-sm font-medium text-foreground">{item.question}</Text>
              <Text className="ml-2 text-sm text-muted-foreground">{isOpen ? '-' : '+'}</Text>
            </Pressable>
            {isOpen && (
              <View className="border-t border-border px-4 py-3">
                <Text className="text-sm text-muted-foreground">{item.answer}</Text>
              </View>
            )}
          </View>
        )
      })}
    </View>
  )
}

export { FAQTransition }
export type { FAQTransitionProps, FAQItem }
