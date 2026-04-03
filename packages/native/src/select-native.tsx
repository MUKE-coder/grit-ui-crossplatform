import React, { useState } from 'react'
import { View, Text, Pressable, Modal, FlatList } from 'react-native'
import { cn } from '@grit-ui/core'

interface SelectOption {
  label: string
  value: string
}

interface SelectNativeProps {
  className?: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

function SelectNative({
  className,
  options,
  value,
  onChange,
  placeholder = 'Select...',
}: SelectNativeProps) {
  const [modalVisible, setModalVisible] = useState(false)
  const selected = options.find((o) => o.value === value)

  return (
    <View className={cn(className)}>
      <Pressable
        onPress={() => setModalVisible(true)}
        className="h-10 flex-row items-center justify-between rounded-md border border-border bg-background px-3"
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

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <Pressable className="flex-1 bg-black/50" onPress={() => setModalVisible(false)}>
          <View className="mt-auto max-h-[50%] rounded-t-2xl bg-background">
            <View className="border-b border-border px-4 py-3">
              <Text className="text-base font-semibold text-foreground">Select</Text>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChange?.(item.value)
                    setModalVisible(false)
                  }}
                  className={cn(
                    'px-4 py-3',
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
    </View>
  )
}

export { SelectNative }
export type { SelectNativeProps, SelectOption }
