import React, { useRef, useState, useCallback } from 'react'
import { View, TextInput } from 'react-native'
import { cn } from '@grit-ui/core'

interface InputOTPProps {
  className?: string
  length?: number
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
}

function InputOTP({
  className,
  length = 6,
  value = '',
  onChange,
  onComplete,
}: InputOTPProps) {
  const inputs = useRef<(TextInput | null)[]>([])

  const handleChange = useCallback(
    (text: string, index: number) => {
      const chars = value.split('')
      chars[index] = text.slice(-1)
      const newValue = chars.join('').slice(0, length)
      onChange?.(newValue)

      if (text && index < length - 1) {
        inputs.current[index + 1]?.focus()
      }

      if (newValue.length === length) {
        onComplete?.(newValue)
      }
    },
    [value, length, onChange, onComplete]
  )

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      if (key === 'Backspace' && !value[index] && index > 0) {
        inputs.current[index - 1]?.focus()
      }
    },
    [value]
  )

  return (
    <View className={cn('flex-row items-center justify-center gap-2', className)}>
      {Array.from({ length }).map((_, i) => (
        <TextInput
          key={i}
          ref={(ref) => { inputs.current[i] = ref }}
          value={value[i] || ''}
          onChangeText={(text) => handleChange(text, i)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          className="h-12 w-10 rounded-md border border-border bg-background text-center text-lg text-foreground"
        />
      ))}
    </View>
  )
}

export { InputOTP }
export type { InputOTPProps }
