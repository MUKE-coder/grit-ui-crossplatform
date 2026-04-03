import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { cn } from '@grit-ui/core'
import { cva, type VariantProps } from '@grit-ui/core'

const groupVariants = cva('gap-2', {
  variants: {
    orientation: {
      vertical: 'flex-col',
      horizontal: 'flex-row flex-wrap',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
})

interface RadioOption {
  label: string
  value: string
  description?: string
  disabled?: boolean
}

interface RadioButtonGroupProps extends VariantProps<typeof groupVariants> {
  className?: string
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
}

function RadioButtonGroup({
  className,
  options,
  value,
  onChange,
  orientation,
}: RadioButtonGroupProps) {
  return (
    <View className={cn(groupVariants({ orientation }), className)}>
      {options.map((option) => {
        const isSelected = value === option.value
        return (
          <Pressable
            key={option.value}
            onPress={() => !option.disabled && onChange?.(option.value)}
            disabled={option.disabled}
            className={cn(
              'flex-row items-start gap-3 rounded-md p-2',
              option.disabled && 'opacity-50'
            )}
          >
            <View
              className={cn(
                'mt-0.5 h-5 w-5 items-center justify-center rounded-full border-2',
                isSelected ? 'border-primary' : 'border-border'
              )}
            >
              {isSelected && <View className="h-2.5 w-2.5 rounded-full bg-primary" />}
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-foreground">{option.label}</Text>
              {option.description && (
                <Text className="text-xs text-muted-foreground">{option.description}</Text>
              )}
            </View>
          </Pressable>
        )
      })}
    </View>
  )
}

export { RadioButtonGroup, groupVariants }
export type { RadioButtonGroupProps, RadioOption }
