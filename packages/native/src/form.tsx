import React from 'react'
import { View } from 'react-native'
import { cn } from '@grit-ui/core'

interface FormProps {
  className?: string
  children: React.ReactNode
  onSubmit?: () => void
}

function Form({ className, children, onSubmit }: FormProps) {
  return <View className={cn('gap-4', className)}>{children}</View>
}

interface FormSectionProps {
  className?: string
  children: React.ReactNode
}

function FormSection({ className, children }: FormSectionProps) {
  return <View className={cn('gap-3', className)}>{children}</View>
}

interface FormActionsProps {
  className?: string
  children: React.ReactNode
}

function FormActions({ className, children }: FormActionsProps) {
  return <View className={cn('flex-row justify-end gap-2 pt-2', className)}>{children}</View>
}

export { Form, FormSection, FormActions }
export type { FormProps, FormSectionProps, FormActionsProps }
