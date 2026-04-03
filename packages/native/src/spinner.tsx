import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { cn } from '@grit-ui/core'
import { cva, type VariantProps } from '@grit-ui/core'

const spinnerVariants = cva('items-center justify-center', {
  variants: {
    size: {
      sm: '',
      default: '',
      lg: '',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

const sizeMap = {
  sm: 'small' as const,
  default: 'small' as const,
  lg: 'large' as const,
}

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
  color?: string
}

function Spinner({ className, size = 'default', color = '#6c5ce7' }: SpinnerProps) {
  return (
    <View className={cn(spinnerVariants({ size }), className)}>
      <ActivityIndicator size={sizeMap[size || 'default']} color={color} />
    </View>
  )
}

export { Spinner, spinnerVariants }
export type { SpinnerProps }
