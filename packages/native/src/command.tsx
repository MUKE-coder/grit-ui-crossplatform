import React, { useState, useMemo } from 'react'
import { View, Text, TextInput, Pressable, Modal, FlatList } from 'react-native'
import { cn } from '@grit-ui/core'

interface CommandItem {
  key: string
  label: string
  description?: string
  icon?: React.ReactNode
  group?: string
  keywords?: string[]
}

interface CommandProps {
  className?: string
  items: CommandItem[]
  onSelect: (item: CommandItem) => void
  placeholder?: string
  visible: boolean
  onClose: () => void
}

function Command({
  className,
  items,
  onSelect,
  placeholder = 'Search commands...',
  visible,
  onClose,
}: CommandProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query) return items
    const lower = query.toLowerCase()
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(lower) ||
        item.description?.toLowerCase().includes(lower) ||
        item.keywords?.some((k) => k.toLowerCase().includes(lower))
    )
  }, [items, query])

  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}
    for (const item of filtered) {
      const group = item.group || 'Commands'
      if (!groups[group]) groups[group] = []
      groups[group].push(item)
    }
    return groups
  }, [filtered])

  const sections = Object.entries(grouped)

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-start bg-black/50 pt-20" onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View
            className={cn(
              'w-80 max-h-[400px] rounded-xl border border-border bg-background',
              className
            )}
          >
            <View className="border-b border-border px-4 py-3">
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={placeholder}
                placeholderTextColor="#9090a8"
                autoFocus
                className="text-sm text-foreground"
              />
            </View>

            {sections.length === 0 ? (
              <View className="items-center py-6">
                <Text className="text-sm text-muted-foreground">No results found</Text>
              </View>
            ) : (
              <FlatList
                data={sections}
                keyExtractor={([group]) => group}
                renderItem={({ item: [group, groupItems] }) => (
                  <View>
                    <View className="px-4 py-1.5">
                      <Text className="text-xs font-medium text-muted-foreground">{group}</Text>
                    </View>
                    {groupItems.map((item) => (
                      <Pressable
                        key={item.key}
                        onPress={() => {
                          onSelect(item)
                          setQuery('')
                          onClose()
                        }}
                        className="flex-row items-center gap-3 px-4 py-2.5 active:bg-muted"
                      >
                        {item.icon && <View>{item.icon}</View>}
                        <View className="flex-1">
                          <Text className="text-sm text-foreground">{item.label}</Text>
                          {item.description && (
                            <Text className="text-xs text-muted-foreground">{item.description}</Text>
                          )}
                        </View>
                      </Pressable>
                    ))}
                  </View>
                )}
              />
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

export { Command }
export type { CommandProps, CommandItem }
