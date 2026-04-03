import React from 'react'
import { Text, View } from 'react-native'
import { cn } from '@grit-ui/core'
import { cva, type VariantProps } from '@grit-ui/core'

const alertVariants = cva(
  'rounded-lg border p-4',
  {
    variants: {
      variant: {
        default: 'border-border bg-background',
        destructive: 'border-destructive/50 bg-destructive/10',
        success: 'border-green-600/50 bg-green-600/10',
        warning: 'border-amber-500/50 bg-amber-500/10',
        info: 'border-blue-500/50 bg-blue-500/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const alertTextVariants = cva('text-sm', {
  variants: {
    variant: {
      default: 'text-foreground',
      destructive: 'text-destructive',
      success: 'text-green-600',
      warning: 'text-amber-500',
      info: 'text-blue-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface AlertProps extends VariantProps<typeof alertVariants> {
  className?: string
  children?: React.ReactNode
}

function Alert({ className, variant, children }: AlertProps) {
  return (
    <View className={cn(alertVariants({ variant }), className)}>
      {children}
    </View>
  )
}

interface AlertTitleProps extends VariantProps<typeof alertTextVariants> {
  className?: string
  children?: React.ReactNode
}

function AlertTitle({ className, variant, children }: AlertTitleProps) {
  return (
    <Text className={cn('mb-1 font-semibold', alertTextVariants({ variant }), className)}>
      {children}
    </Text>
  )
}

interface AlertDescriptionProps extends VariantProps<typeof alertTextVariants> {
  className?: string
  children?: React.ReactNode
}

function AlertDescription({ className, variant, children }: AlertDescriptionProps) {
  return (
    <Text className={cn(alertTextVariants({ variant }), 'opacity-80', className)}>
      {children}
    </Text>
  )
}

export { Alert, AlertTitle, AlertDescription, alertVariants }
export type { AlertProps, AlertTitleProps, AlertDescriptionProps }
