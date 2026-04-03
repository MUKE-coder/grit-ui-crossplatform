import React from 'react'
import { Text } from 'react-native'
import { cn } from '@grit-ui/core'

interface LabelProps {
  className?: string
  children?: React.ReactNode
  required?: boolean
  htmlFor?: string
}

function Label({ className, children, required }: LabelProps) {
  return (
    <Text className={cn('text-sm font-medium text-foreground', className)}>
      {children}
      {required && <Text className="text-destructive"> *</Text>}
    </Text>
  )
}

export { Label }
export type { LabelProps }
