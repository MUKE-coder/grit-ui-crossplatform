import React from 'react'
import { View, Text } from 'react-native'
import { cn } from '@grit-ui/core'

interface DragAndDropProps {
  className?: string
  children: React.ReactNode
}

/**
 * Placeholder drag-and-drop component.
 * For production use, integrate with react-native-gesture-handler and
 * react-native-reanimated for proper drag interactions.
 */
function DragAndDrop({ className, children }: DragAndDropProps) {
  return <View className={cn(className)}>{children}</View>
}

interface DraggableItemProps {
  className?: string
  children: React.ReactNode
}

function DraggableItem({ className, children }: DraggableItemProps) {
  return (
    <View className={cn('rounded-md border border-border bg-background p-3', className)}>
      {children}
    </View>
  )
}

interface DropZoneProps {
  className?: string
  children?: React.ReactNode
  label?: string
}

function DropZone({ className, children, label = 'Drop here' }: DropZoneProps) {
  return (
    <View
      className={cn(
        'items-center justify-center rounded-md border-2 border-dashed border-border p-6',
        className
      )}
    >
      {children || <Text className="text-sm text-muted-foreground">{label}</Text>}
    </View>
  )
}

export { DragAndDrop, DraggableItem, DropZone }
export type { DragAndDropProps, DraggableItemProps, DropZoneProps }
