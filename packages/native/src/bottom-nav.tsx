import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface BottomNavItem {
  key: string
  label: string
  icon?: React.ReactNode
  badge?: number
}

interface BottomNavProps {
  className?: string
  items: BottomNavItem[]
  activeKey?: string
  onItemPress?: (key: string) => void
}

function BottomNav({ className, items, activeKey, onItemPress }: BottomNavProps) {
  return (
    <View
      className={cn(
        'absolute bottom-0 left-0 right-0 flex-row border-t border-border bg-background pb-2 pt-1',
        className
      )}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey
        return (
          <Pressable
            key={item.key}
            onPress={() => onItemPress?.(item.key)}
            className="flex-1 items-center justify-center py-1"
          >
            <View className="relative">
              {item.icon ? (
                item.icon
              ) : (
                <View
                  className={cn(
                    'h-6 w-6 rounded-full',
                    isActive ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
              {item.badge !== undefined && item.badge > 0 && (
                <View className="absolute -right-2 -top-1 h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1">
                  <Text className="text-[10px] text-white font-medium">
                    {item.badge > 99 ? '99+' : item.badge}
                  </Text>
                </View>
              )}
            </View>
            <Text
              className={cn(
                'mt-1 text-[10px]',
                isActive ? 'text-primary font-medium' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

export { BottomNav }
export type { BottomNavProps, BottomNavItem }
