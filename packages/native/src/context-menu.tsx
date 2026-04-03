import React, { useState } from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface ContextMenuItem {
  key: string
  label: string
  onPress?: () => void
  destructive?: boolean
  disabled?: boolean
  icon?: React.ReactNode
}

interface ContextMenuProps {
  className?: string
  children: React.ReactNode
  items: ContextMenuItem[]
  delayMs?: number
}

function ContextMenu({
  className,
  children,
  items,
  delayMs = 500,
}: ContextMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Pressable
        onLongPress={() => setOpen(true)}
        delayLongPress={delayMs}
      >
        {children}
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable
          onPress={() => setOpen(false)}
          className="flex-1 items-center justify-center bg-black/30"
        >
          <Pressable onPress={() => {}}>
            <View
              className={cn(
                'w-56 overflow-hidden rounded-lg border border-border bg-background shadow-lg',
                className
              )}
            >
              {items.map((item, i) => (
                <React.Fragment key={item.key}>
                  <Pressable
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
                  {i < items.length - 1 && <View className="h-px bg-border" />}
                </React.Fragment>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  )
}

export { ContextMenu }
export type { ContextMenuProps, ContextMenuItem }
