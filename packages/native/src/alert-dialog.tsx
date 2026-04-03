import React from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface AlertDialogProps {
  className?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  cancelText?: string
  confirmText?: string
  onCancel?: () => void
  onConfirm?: () => void
  destructive?: boolean
}

function AlertDialog({
  className,
  open,
  onOpenChange,
  title,
  description,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  onCancel,
  onConfirm,
  destructive = false,
}: AlertDialogProps) {
  function handleCancel() {
    onCancel?.()
    onOpenChange(false)
  }

  function handleConfirm() {
    onConfirm?.()
    onOpenChange(false)
  }

  return (
    <Modal visible={open} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View
          className={cn(
            'w-11/12 max-w-sm rounded-lg border border-border bg-background p-6',
            className
          )}
        >
          <Text className="text-lg font-semibold text-foreground">{title}</Text>
          {description && (
            <Text className="mt-2 text-sm text-muted-foreground">{description}</Text>
          )}

          <View className="mt-6 flex-row justify-end gap-2">
            <Pressable
              onPress={handleCancel}
              className="rounded-md border border-border px-4 py-2"
            >
              <Text className="text-sm font-medium text-foreground">{cancelText}</Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              className={cn(
                'rounded-md px-4 py-2',
                destructive ? 'bg-destructive' : 'bg-primary'
              )}
            >
              <Text className="text-sm font-medium text-white">{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export { AlertDialog }
export type { AlertDialogProps }
