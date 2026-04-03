import React from 'react'
import { Text, View } from 'react-native'
import { cn } from '@grit-ui/core'
import { cva, type VariantProps } from '@grit-ui/core'

const calloutVariants = cva(
  'rounded-lg border-l-4 p-4',
  {
    variants: {
      variant: {
        info: 'border-l-blue-500 bg-blue-500/10',
        warning: 'border-l-amber-500 bg-amber-500/10',
        danger: 'border-l-destructive bg-destructive/10',
        success: 'border-l-green-600 bg-green-600/10',
        default: 'border-l-border bg-muted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const calloutTextVariants = cva('text-sm', {
  variants: {
    variant: {
      info: 'text-blue-500',
      warning: 'text-amber-500',
      danger: 'text-destructive',
      success: 'text-green-600',
      default: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface CalloutProps extends VariantProps<typeof calloutVariants> {
  className?: string
  title?: string
  children?: React.ReactNode
}

function Callout({ className, variant, title, children }: CalloutProps) {
  return (
    <View className={cn(calloutVariants({ variant }), className)}>
      {title && (
        <Text className={cn('font-semibold mb-1', calloutTextVariants({ variant }))}>
          {title}
        </Text>
      )}
      {typeof children === 'string' ? (
        <Text className={cn(calloutTextVariants({ variant }), 'opacity-80')}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  )
}

export { Callout, calloutVariants }
export type { CalloutProps }
