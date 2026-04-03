import React from 'react'
import { Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface HeaderProps {
  className?: string
  title?: string
  subtitle?: string
  leftAction?: React.ReactNode
  rightAction?: React.ReactNode
  children?: React.ReactNode
}

function Header({
  className,
  title,
  subtitle,
  leftAction,
  rightAction,
  children,
}: HeaderProps) {
  return (
    <View
      className={cn(
        'flex-row items-center justify-between border-b border-border bg-background px-4 py-3',
        className
      )}
    >
      <View className="flex-row items-center gap-3">
        {leftAction}
        <View>
          {title && (
            <Text className="text-lg font-semibold text-foreground">{title}</Text>
          )}
          {subtitle && (
            <Text className="text-xs text-muted-foreground">{subtitle}</Text>
          )}
        </View>
      </View>

      {children}

      {rightAction && <View className="flex-row items-center gap-2">{rightAction}</View>}
    </View>
  )
}

export { Header }
export type { HeaderProps }
