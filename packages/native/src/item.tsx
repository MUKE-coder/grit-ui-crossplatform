import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface ItemProps {
  className?: string
  title: string
  description?: string
  icon?: React.ReactNode
  rightContent?: React.ReactNode
  onPress?: () => void
  disabled?: boolean
}

function Item({
  className,
  title,
  description,
  icon,
  rightContent,
  onPress,
  disabled,
}: ItemProps) {
  const Container = onPress ? Pressable : View

  return (
    <Container
      onPress={onPress}
      disabled={disabled}
      className={cn(
        'flex-row items-center gap-3 px-4 py-3',
        disabled && 'opacity-50',
        className
      )}
    >
      {icon && <View className="items-center justify-center">{icon}</View>}

      <View className="flex-1">
        <Text className="text-sm font-medium text-foreground">{title}</Text>
        {description && (
          <Text className="mt-0.5 text-xs text-muted-foreground">{description}</Text>
        )}
      </View>

      {rightContent && <View>{rightContent}</View>}
    </Container>
  )
}

export { Item }
export type { ItemProps }
