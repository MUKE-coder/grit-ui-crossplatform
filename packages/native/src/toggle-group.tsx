import React from 'react'
import { View, Pressable, Text } from 'react-native'
import { cn } from '@grit-ui/core'
import { cva, type VariantProps } from '@grit-ui/core'

const toggleGroupVariants = cva('flex-row items-center rounded-lg border border-border', {
  variants: {
    size: {
      sm: 'h-8',
      default: 'h-10',
      lg: 'h-12',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

const toggleItemVariants = cva('items-center justify-center px-3', {
  variants: {
    size: {
      sm: 'h-8 px-2',
      default: 'h-10 px-3',
      lg: 'h-12 px-4',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

interface ToggleGroupOption {
  label: string
  value: string
  icon?: React.ReactNode
}

type ToggleGroupType = 'single' | 'multiple'

interface ToggleGroupProps extends VariantProps<typeof toggleGroupVariants> {
  className?: string
  options: ToggleGroupOption[]
  type?: ToggleGroupType
  value: string | string[]
  onChange: (value: string | string[]) => void
}

function ToggleGroup({
  className,
  options,
  type = 'single',
  value,
  onChange,
  size,
}: ToggleGroupProps) {
  const isSelected = (optionValue: string) => {
    if (type === 'single') return value === optionValue
    return Array.isArray(value) && value.includes(optionValue)
  }

  const handlePress = (optionValue: string) => {
    if (type === 'single') {
      onChange(optionValue)
    } else {
      const current = Array.isArray(value) ? value : []
      if (current.includes(optionValue)) {
        onChange(current.filter((v) => v !== optionValue))
      } else {
        onChange([...current, optionValue])
      }
    }
  }

  return (
    <View className={cn(toggleGroupVariants({ size }), className)}>
      {options.map((option, i) => {
        const selected = isSelected(option.value)
        return (
          <Pressable
            key={option.value}
            onPress={() => handlePress(option.value)}
            className={cn(
              toggleItemVariants({ size }),
              selected && 'bg-primary',
              i > 0 && 'border-l border-border'
            )}
          >
            {option.icon ? (
              option.icon
            ) : (
              <Text
                className={cn(
                  'text-sm',
                  selected ? 'font-medium text-primary-foreground' : 'text-foreground'
                )}
              >
                {option.label}
              </Text>
            )}
          </Pressable>
        )
      })}
    </View>
  )
}

export { ToggleGroup, toggleGroupVariants, toggleItemVariants }
export type { ToggleGroupProps, ToggleGroupOption, ToggleGroupType }
