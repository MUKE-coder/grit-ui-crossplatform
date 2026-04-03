import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface NavigationMenuItem {
  key: string
  label: string
  onPress?: () => void
  disabled?: boolean
}

interface NavigationMenuProps {
  className?: string
  items: NavigationMenuItem[]
  activeKey?: string
}

function NavigationMenu({ className, items, activeKey }: NavigationMenuProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={cn('border-b border-border', className)}
    >
      <View className="flex-row gap-1 px-2">
        {items.map((item) => {
          const isActive = item.key === activeKey
          return (
            <Pressable
              key={item.key}
              onPress={item.onPress}
              disabled={item.disabled}
              className={cn(
                'px-3 py-2 rounded-md',
                isActive && 'bg-primary/10',
                item.disabled && 'opacity-50'
              )}
            >
              <Text
                className={cn(
                  'text-sm font-medium',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </ScrollView>
  )
}

export { NavigationMenu }
export type { NavigationMenuProps, NavigationMenuItem }
