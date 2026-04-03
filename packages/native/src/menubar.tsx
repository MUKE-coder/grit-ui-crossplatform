import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface MenubarItem {
  key: string
  label: string
  onPress?: () => void
  disabled?: boolean
}

interface MenubarProps {
  className?: string
  items: MenubarItem[]
}

function Menubar({ className, items }: MenubarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={cn('border-b border-border bg-background', className)}
    >
      <View className="flex-row items-center px-1">
        {items.map((item) => (
          <Pressable
            key={item.key}
            onPress={item.onPress}
            disabled={item.disabled}
            className={cn(
              'px-3 py-2 rounded-md',
              item.disabled && 'opacity-50'
            )}
          >
            <Text className="text-sm font-medium text-foreground">{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  )
}

export { Menubar }
export type { MenubarProps, MenubarItem }
