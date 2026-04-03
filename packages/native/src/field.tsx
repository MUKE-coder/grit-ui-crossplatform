import React from 'react'
import { View, Text } from 'react-native'
import { cn } from '@grit-ui/core'

interface FieldProps {
  className?: string
  label?: string
  description?: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

function Field({ className, label, description, error, required, children }: FieldProps) {
  return (
    <View className={cn('gap-1.5', className)}>
      {label && (
        <Text className="text-sm font-medium text-foreground">
          {label}
          {required && <Text className="text-destructive"> *</Text>}
        </Text>
      )}
      {children}
      {description && !error && (
        <Text className="text-xs text-muted-foreground">{description}</Text>
      )}
      {error && <Text className="text-xs text-destructive">{error}</Text>}
    </View>
  )
}

export { Field }
export type { FieldProps }
