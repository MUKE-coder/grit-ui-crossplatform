import React from 'react'
import { View, TextInput, type TextInputProps } from 'react-native'
import { cn } from '@grit-ui/core'

interface InputGroupProps extends Omit<TextInputProps, 'style'> {
  className?: string
  leftIcon?: React.ReactNode
  rightElement?: React.ReactNode
}

function InputGroup({
  className,
  leftIcon,
  rightElement,
  ...props
}: InputGroupProps) {
  return (
    <View
      className={cn(
        'flex-row items-center rounded-md border border-border bg-background',
        className
      )}
    >
      {leftIcon && <View className="pl-3">{leftIcon}</View>}
      <TextInput
        placeholderTextColor="#9090a8"
        className={cn(
          'flex-1 py-2 text-sm text-foreground',
          leftIcon ? 'pl-2' : 'pl-3',
          rightElement ? 'pr-1' : 'pr-3'
        )}
        {...props}
      />
      {rightElement && <View className="pr-1">{rightElement}</View>}
    </View>
  )
}

export { InputGroup }
export type { InputGroupProps }
