import React, { useState } from 'react'
import { Image, Text, View } from 'react-native'
import { cn } from '@grit-ui/core'
import { cva, type VariantProps } from '@grit-ui/core'

const avatarVariants = cva(
  'items-center justify-center overflow-hidden rounded-full bg-muted',
  {
    variants: {
      size: {
        xs: 'h-6 w-6',
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

const avatarTextVariants = cva('font-medium text-muted-foreground', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-xs',
      default: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  className?: string
  src?: string
  alt?: string
  fallback?: string
}

function Avatar({ className, size, src, alt, fallback }: AvatarProps) {
  const [hasError, setHasError] = useState(false)

  const initials =
    fallback ||
    (alt
      ? alt
          .split(' ')
          .map((w) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : '?')

  return (
    <View className={cn(avatarVariants({ size }), className)}>
      {src && !hasError ? (
        <Image
          source={{ uri: src }}
          className="h-full w-full"
          accessibilityLabel={alt}
          onError={() => setHasError(true)}
        />
      ) : (
        <Text className={cn(avatarTextVariants({ size }))}>{initials}</Text>
      )}
    </View>
  )
}

interface AvatarGroupProps {
  className?: string
  children?: React.ReactNode
  max?: number
}

function AvatarGroup({ className, children, max }: AvatarGroupProps) {
  const childArray = React.Children.toArray(children)
  const visible = max ? childArray.slice(0, max) : childArray
  const remaining = max ? childArray.length - max : 0

  return (
    <View className={cn('flex-row -space-x-2', className)}>
      {visible.map((child, i) => (
        <View key={i} className="border-2 border-background rounded-full">
          {child}
        </View>
      ))}
      {remaining > 0 && (
        <View className="h-10 w-10 items-center justify-center rounded-full bg-muted border-2 border-background">
          <Text className="text-xs font-medium text-muted-foreground">
            +{remaining}
          </Text>
        </View>
      )}
    </View>
  )
}

export { Avatar, AvatarGroup, avatarVariants }
export type { AvatarProps, AvatarGroupProps }
