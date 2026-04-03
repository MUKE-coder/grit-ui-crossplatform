import React from 'react'
import { Linking, Pressable, Text } from 'react-native'
import { cn } from '@grit-ui/core'

interface LinkProps {
  className?: string
  textClassName?: string
  href?: string
  onPress?: () => void
  children?: React.ReactNode
  external?: boolean
}

function Link({
  className,
  textClassName,
  href,
  onPress,
  children,
  external = true,
}: LinkProps) {
  function handlePress() {
    if (onPress) {
      onPress()
    } else if (href && external) {
      Linking.openURL(href)
    }
  }

  return (
    <Pressable onPress={handlePress} className={className}>
      {typeof children === 'string' ? (
        <Text
          className={cn('text-sm text-primary underline', textClassName)}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  )
}

export { Link }
export type { LinkProps }
