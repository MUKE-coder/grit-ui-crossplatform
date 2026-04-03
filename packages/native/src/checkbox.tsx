import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface CheckboxProps {
  className?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string
}

function Checkbox({
  className,
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  label,
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked

  function handlePress() {
    if (disabled) return
    const next = !isChecked
    setInternalChecked(next)
    onCheckedChange?.(next)
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      className={cn('flex-row items-center gap-2', disabled && 'opacity-50', className)}
    >
      <View
        className={cn(
          'h-5 w-5 items-center justify-center rounded border',
          isChecked ? 'border-primary bg-primary' : 'border-border bg-background'
        )}
      >
        {isChecked && <Text className="text-xs text-primary-foreground">✓</Text>}
      </View>
      {label && <Text className="text-sm text-foreground">{label}</Text>}
    </Pressable>
  )
}

export { Checkbox }
export type { CheckboxProps }
