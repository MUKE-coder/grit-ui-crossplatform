import React from 'react'
import { Switch as RNSwitch, View, Text } from 'react-native'
import { cn } from '@grit-ui/core'

interface SwitchProps {
  className?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string
  trackColor?: { false: string; true: string }
  thumbColor?: string
}

function Switch({
  className,
  checked = false,
  onCheckedChange,
  disabled,
  label,
  trackColor = { false: '#2a2a3a', true: '#6c5ce7' },
  thumbColor = '#ffffff',
}: SwitchProps) {
  return (
    <View className={cn('flex-row items-center gap-2', disabled && 'opacity-50', className)}>
      <RNSwitch
        value={checked}
        onValueChange={onCheckedChange}
        disabled={disabled}
        trackColor={trackColor}
        thumbColor={thumbColor}
      />
      {label && <Text className="text-sm text-foreground">{label}</Text>}
    </View>
  )
}

export { Switch }
export type { SwitchProps }
