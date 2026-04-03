import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface BreadcrumbItem {
  label: string
  onPress?: () => void
}

interface BreadcrumbProps {
  className?: string
  items: BreadcrumbItem[]
  separator?: string
}

function Breadcrumb({ className, items, separator = '/' }: BreadcrumbProps) {
  return (
    <View className={cn('flex-row items-center flex-wrap', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <View key={index} className="flex-row items-center">
            {item.onPress && !isLast ? (
              <Pressable onPress={item.onPress}>
                <Text className="text-sm text-primary">{item.label}</Text>
              </Pressable>
            ) : (
              <Text
                className={cn(
                  'text-sm',
                  isLast ? 'text-foreground font-medium' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Text>
            )}
            {!isLast && (
              <Text className="mx-2 text-sm text-muted-foreground">{separator}</Text>
            )}
          </View>
        )
      })}
    </View>
  )
}

export { Breadcrumb }
export type { BreadcrumbProps, BreadcrumbItem }
