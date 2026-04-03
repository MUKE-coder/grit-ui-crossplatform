import React from 'react'
import { Text, View } from 'react-native'
import { cn } from '@grit-ui/core'
import { cva, type VariantProps } from '@grit-ui/core'

const badgeVariants = cva(
  'flex-row items-center rounded-full px-2.5 py-0.5',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        secondary: 'bg-secondary',
        destructive: 'bg-destructive',
        outline: 'border border-border bg-transparent',
        success: 'bg-green-600',
        warning: 'bg-amber-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const badgeTextVariants = cva('text-xs font-medium', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-foreground',
      success: 'text-white',
      warning: 'text-white',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string
  textClassName?: string
  children?: React.ReactNode
}

function Badge({ className, textClassName, variant, children }: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)}>
      {typeof children === 'string' ? (
        <Text className={cn(badgeTextVariants({ variant }), textClassName)}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  )
}

export { Badge, badgeVariants, badgeTextVariants }
export type { BadgeProps }
