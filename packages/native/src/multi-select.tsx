import React, { useState } from 'react'
import { View, Text, Pressable, Modal, FlatList, ScrollView } from 'react-native'
import { cn } from '@grit-ui/core'

interface MultiSelectOption {
  label: string
  value: string
}

interface MultiSelectProps {
  className?: string
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  maxDisplay?: number
}

function MultiSelect({
  className,
  options,
  value,
  onChange,
  placeholder = 'Select items...',
  maxDisplay = 3,
}: MultiSelectProps) {
  const [modalVisible, setModalVisible] = useState(false)

  const selectedLabels = options
    .filter((o) => value.includes(o.value))
    .map((o) => o.label)

  const toggleItem = (itemValue: string) => {
    if (value.includes(itemValue)) {
      onChange(value.filter((v) => v !== itemValue))
    } else {
      onChange([...value, itemValue])
    }
  }

  const removeItem = (itemValue: string) => {
    onChange(value.filter((v) => v !== itemValue))
  }

  return (
    <View className={cn(className)}>
      <Pressable
        onPress={() => setModalVisible(true)}
        className="min-h-[40px] flex-row flex-wrap items-center rounded-md border border-border bg-background px-3 py-1.5"
      >
        {value.length === 0 ? (
          <Text className="text-sm text-muted-foreground">{placeholder}</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-1">
              {selectedLabels.slice(0, maxDisplay).map((label, i) => (
                <Pressable
                  key={value[i]}
                  onPress={() => removeItem(value[i])}
                  className="flex-row items-center rounded-full bg-secondary px-2 py-0.5"
                >
                  <Text className="text-xs text-secondary-foreground">{label}</Text>
                  <Text className="ml-1 text-xs text-muted-foreground">x</Text>
                </Pressable>
              ))}
              {value.length > maxDisplay && (
                <View className="items-center justify-center rounded-full bg-secondary px-2 py-0.5">
                  <Text className="text-xs text-muted-foreground">
                    +{value.length - maxDisplay}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </Pressable>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <Pressable className="flex-1 bg-black/50" onPress={() => setModalVisible(false)}>
          <View className="mt-auto max-h-[60%] rounded-t-2xl bg-background">
            <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
              <Text className="text-base font-semibold text-foreground">Select Items</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text className="text-sm text-primary">Done</Text>
              </Pressable>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = value.includes(item.value)
                return (
                  <Pressable
                    onPress={() => toggleItem(item.value)}
                    className={cn(
                      'flex-row items-center px-4 py-3',
                      isSelected && 'bg-primary/10'
                    )}
                  >
                    <View
                      className={cn(
                        'mr-3 h-5 w-5 items-center justify-center rounded border',
                        isSelected ? 'border-primary bg-primary' : 'border-border'
                      )}
                    >
                      {isSelected && <Text className="text-xs text-primary-foreground">✓</Text>}
                    </View>
                    <Text className="text-sm text-foreground">{item.label}</Text>
                  </Pressable>
                )
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

export { MultiSelect }
export type { MultiSelectProps, MultiSelectOption }
