import React, { useState } from 'react'
import { FlatList, Modal, Pressable, Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface SelectOption {
  label: string
  value: string
}

interface SelectProps {
  className?: string
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

function Select({
  className,
  options,
  value,
  onValueChange,
  placeholder = 'Select...',
  disabled,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value)

  return (
    <>
      <Pressable
        onPress={() => !disabled && setOpen(true)}
        disabled={disabled}
        className={cn(
          'h-10 flex-row items-center justify-between rounded-md border border-border bg-background px-3',
          disabled && 'opacity-50',
          className
        )}
      >
        <Text
          className={cn(
            'text-sm',
            selected ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {selected ? selected.label : placeholder}
        </Text>
        <Text className="text-xs text-muted-foreground">▼</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable
          onPress={() => setOpen(false)}
          className="flex-1 items-center justify-center bg-black/50"
        >
          <View className="w-4/5 max-h-80 rounded-lg bg-background border border-border">
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onValueChange?.(item.value)
                    setOpen(false)
                  }}
                  className={cn(
                    'px-4 py-3 border-b border-border',
                    item.value === value && 'bg-primary/10'
                  )}
                >
                  <Text
                    className={cn(
                      'text-sm',
                      item.value === value ? 'text-primary font-medium' : 'text-foreground'
                    )}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

export { Select }
export type { SelectProps, SelectOption }
