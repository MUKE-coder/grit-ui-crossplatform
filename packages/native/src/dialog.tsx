import React from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface DialogProps {
  className?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: React.ReactNode
}

function Dialog({ className, open, onOpenChange, children }: DialogProps) {
  return (
    <Modal visible={open} transparent animationType="fade">
      <Pressable
        onPress={() => onOpenChange(false)}
        className="flex-1 items-center justify-center bg-black/50"
      >
        <Pressable
          onPress={() => {}}
          className={cn(
            'w-11/12 max-w-md rounded-lg border border-border bg-background p-6',
            className
          )}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  )
}

interface DialogHeaderProps {
  className?: string
  children?: React.ReactNode
}

function DialogHeader({ className, children }: DialogHeaderProps) {
  return <View className={cn('mb-4', className)}>{children}</View>
}

interface DialogTitleProps {
  className?: string
  children?: React.ReactNode
}

function DialogTitle({ className, children }: DialogTitleProps) {
  return (
    <Text className={cn('text-lg font-semibold text-foreground', className)}>
      {children}
    </Text>
  )
}

interface DialogDescriptionProps {
  className?: string
  children?: React.ReactNode
}

function DialogDescription({ className, children }: DialogDescriptionProps) {
  return (
    <Text className={cn('mt-1 text-sm text-muted-foreground', className)}>
      {children}
    </Text>
  )
}

interface DialogFooterProps {
  className?: string
  children?: React.ReactNode
}

function DialogFooter({ className, children }: DialogFooterProps) {
  return (
    <View className={cn('mt-4 flex-row justify-end gap-2', className)}>
      {children}
    </View>
  )
}

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter }
export type {
  DialogProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogFooterProps,
}
