import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface RadioButtonProps {
  className?: string
  selected?: boolean
  onPress?: () => void
  disabled?: boolean
  label?: string
  value?: string
}

function RadioButton({
  className,
  selected,
  onPress,
  disabled,
  label,
}: RadioButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn('flex-row items-center gap-2', disabled && 'opacity-50', className)}
    >
      <View
        className={cn(
          'h-5 w-5 items-center justify-center rounded-full border-2',
          selected ? 'border-primary' : 'border-border'
        )}
      >
        {selected && <View className="h-2.5 w-2.5 rounded-full bg-primary" />}
      </View>
      {label && <Text className="text-sm text-foreground">{label}</Text>}
    </Pressable>
  )
}

interface RadioGroupProps {
  className?: string
  value?: string
  onValueChange?: (value: string) => void
  children?: React.ReactNode
}

function RadioGroup({ className, value, onValueChange, children }: RadioGroupProps) {
  return (
    <View className={cn('gap-2', className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<RadioButtonProps>(child)) return child
        return React.cloneElement(child, {
          selected: child.props.value === value,
          onPress: () => child.props.value && onValueChange?.(child.props.value),
        })
      })}
    </View>
  )
}

export { RadioButton, RadioGroup }
export type { RadioButtonProps, RadioGroupProps }
