import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { cn } from '@grit-ui/core'

interface EmptyProps {
  className?: string
  icon?: React.ReactNode
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

function Empty({
  className,
  icon,
  title = 'No results',
  description,
  actionLabel,
  onAction,
}: EmptyProps) {
  return (
    <View className={cn('items-center justify-center px-6 py-12', className)}>
      {icon && <View className="mb-4">{icon}</View>}
      <Text className="text-center text-base font-semibold text-foreground">{title}</Text>
      {description && (
        <Text className="mt-1 text-center text-sm text-muted-foreground">{description}</Text>
      )}
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          className="mt-4 rounded-md bg-primary px-4 py-2"
        >
          <Text className="text-sm font-medium text-primary-foreground">{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  )
}

export { Empty }
export type { EmptyProps }
