import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { cn } from '@grit-ui/core'
import { cva, type VariantProps } from '@grit-ui/core'

const chipVariants = cva(
  'flex-row items-center rounded-full px-3 py-1',
  {
    variants: {
      variant: {
        default: 'bg-primary/10',
        secondary: 'bg-secondary',
        outline: 'border border-border bg-transparent',
      },
      size: {
        sm: 'px-2 py-0.5',
        default: 'px-3 py-1',
        lg: 'px-4 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const chipTextVariants = cva('font-medium', {
  variants: {
    variant: {
      default: 'text-primary',
      secondary: 'text-secondary-foreground',
      outline: 'text-foreground',
    },
    size: {
      sm: 'text-xs',
      default: 'text-sm',
      lg: 'text-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

interface ChipProps extends VariantProps<typeof chipVariants> {
  className?: string
  children?: React.ReactNode
  onDismiss?: () => void
  dismissible?: boolean
}

function Chip({
  className,
  variant,
  size,
  children,
  onDismiss,
  dismissible = false,
}: ChipProps) {
  return (
    <View className={cn(chipVariants({ variant, size }), className)}>
      {typeof children === 'string' ? (
        <Text className={cn(chipTextVariants({ variant, size }))}>{children}</Text>
      ) : (
        children
      )}
      {dismissible && onDismiss && (
        <Pressable onPress={onDismiss} className="ml-1">
          <Text className={cn(chipTextVariants({ variant, size }), 'opacity-60')}>
            ✕
          </Text>
        </Pressable>
      )}
    </View>
  )
}

interface ChipGroupProps {
  className?: string
  children?: React.ReactNode
}

function ChipGroup({ className, children }: ChipGroupProps) {
  return (
    <View className={cn('flex-row flex-wrap gap-2', className)}>
      {children}
    </View>
  )
}

export { Chip, ChipGroup, chipVariants }
export type { ChipProps, ChipGroupProps }
