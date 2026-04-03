import React, { useState } from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface DropdownMenuItem {
  key: string
  label: string
  onPress?: () => void
  destructive?: boolean
  disabled?: boolean
  icon?: React.ReactNode
}

interface DropdownMenuSection {
  title?: string
  items: DropdownMenuItem[]
}

interface DropdownMenuProps {
  className?: string
  trigger: React.ReactNode
  sections: DropdownMenuSection[]
}

function DropdownMenu({ className, trigger, sections }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Pressable onPress={() => setOpen(true)}>{trigger}</Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable
          onPress={() => setOpen(false)}
          className="flex-1 justify-end bg-black/50"
        >
          <Pressable onPress={() => {}} className={cn('pb-8', className)}>
            <View className="mx-4 overflow-hidden rounded-lg border border-border bg-background">
              {sections.map((section, si) => (
                <View key={si}>
                  {section.title && (
                    <Text className="px-4 pt-3 pb-1 text-xs font-semibold uppercase text-muted-foreground">
                      {section.title}
                    </Text>
                  )}
                  {section.items.map((item) => (
                    <Pressable
                      key={item.key}
                      onPress={() => {
                        if (!item.disabled) {
                          item.onPress?.()
                          setOpen(false)
                        }
                      }}
                      disabled={item.disabled}
                      className={cn(
                        'flex-row items-center gap-3 px-4 py-3',
                        item.disabled && 'opacity-50'
                      )}
                    >
                      {item.icon}
                      <Text
                        className={cn(
                          'text-sm',
                          item.destructive ? 'text-destructive' : 'text-foreground'
                        )}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  ))}
                  {si < sections.length - 1 && (
                    <View className="h-px bg-border" />
                  )}
                </View>
              ))}
            </View>

            <Pressable
              onPress={() => setOpen(false)}
              className="mx-4 mt-2 items-center rounded-lg bg-background py-3 border border-border"
            >
              <Text className="text-sm font-medium text-foreground">Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  )
}

export { DropdownMenu }
export type { DropdownMenuProps, DropdownMenuSection, DropdownMenuItem }
