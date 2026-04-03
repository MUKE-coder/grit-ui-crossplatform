import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface SidenavItem {
  key: string
  label: string
  icon?: React.ReactNode
  section?: string
}

interface SidenavProps {
  className?: string
  items: SidenavItem[]
  activeKey?: string
  onItemPress?: (key: string) => void
  header?: React.ReactNode
  footer?: React.ReactNode
}

function Sidenav({
  className,
  items,
  activeKey,
  onItemPress,
  header,
  footer,
}: SidenavProps) {
  const sections = items.reduce<Record<string, SidenavItem[]>>((acc, item) => {
    const section = item.section || ''
    if (!acc[section]) acc[section] = []
    acc[section].push(item)
    return acc
  }, {})

  return (
    <View className={cn('w-64 bg-card border-r border-border', className)}>
      {header && <View className="p-4 border-b border-border">{header}</View>}

      <View className="flex-1 py-2">
        {Object.entries(sections).map(([section, sectionItems]) => (
          <View key={section || 'default'}>
            {section ? (
              <Text className="px-4 py-2 text-xs font-semibold uppercase text-muted-foreground">
                {section}
              </Text>
            ) : null}
            {sectionItems.map((item) => {
              const isActive = item.key === activeKey
              return (
                <Pressable
                  key={item.key}
                  onPress={() => onItemPress?.(item.key)}
                  className={cn(
                    'mx-2 flex-row items-center gap-3 rounded-md px-3 py-2',
                    isActive && 'bg-primary/10'
                  )}
                >
                  {item.icon}
                  <Text
                    className={cn(
                      'text-sm',
                      isActive ? 'text-primary font-medium' : 'text-foreground'
                    )}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        ))}
      </View>

      {footer && <View className="p-4 border-t border-border">{footer}</View>}
    </View>
  )
}

export { Sidenav }
export type { SidenavProps, SidenavItem }
