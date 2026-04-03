import React from 'react'
import { View, Text } from 'react-native'
import { cn } from '@grit-ui/core'
import { cva, type VariantProps } from '@grit-ui/core'

const statusVariants = cva('flex-row items-center gap-1.5', {
  variants: {
    variant: {
      default: '',
      success: '',
      warning: '',
      error: '',
      info: '',
    },
    size: {
      sm: '',
      default: '',
      lg: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

const dotColors: Record<string, string> = {
  default: 'bg-muted-foreground',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
}

const textColors: Record<string, string> = {
  default: 'text-muted-foreground',
  success: 'text-green-500',
  warning: 'text-amber-500',
  error: 'text-red-500',
  info: 'text-blue-500',
}

const dotSizes: Record<string, string> = {
  sm: 'h-1.5 w-1.5',
  default: 'h-2 w-2',
  lg: 'h-2.5 w-2.5',
}

const textSizes: Record<string, string> = {
  sm: 'text-xs',
  default: 'text-sm',
  lg: 'text-base',
}

interface StatusProps extends VariantProps<typeof statusVariants> {
  className?: string
  label: string
}

function Status({ className, label, variant = 'default', size = 'default' }: StatusProps) {
  return (
    <View className={cn(statusVariants({ variant, size }), className)}>
      <View className={cn('rounded-full', dotColors[variant!], dotSizes[size!])} />
      <Text className={cn(textColors[variant!], textSizes[size!])}>{label}</Text>
    </View>
  )
}

export { Status, statusVariants }
export type { StatusProps }
