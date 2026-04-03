import React, { useState } from 'react'
import { LayoutAnimation, Platform, Pressable, Text, UIManager, View } from 'react-native'
import { cn } from '@grit-ui/core'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

interface CollapsibleProps {
  className?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

function Collapsible({
  className,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    const next = !isOpen
    setInternalOpen(next)
    onOpenChange?.(next)
  }

  return (
    <View className={className}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        if ((child.type as any).displayName === 'CollapsibleTrigger') {
          return React.cloneElement(child as React.ReactElement<any>, { onPress: toggle })
        }
        if ((child.type as any).displayName === 'CollapsibleContent') {
          return isOpen ? child : null
        }
        return child
      })}
    </View>
  )
}

interface CollapsibleTriggerProps {
  className?: string
  children?: React.ReactNode
  onPress?: () => void
}

function CollapsibleTrigger({ className, children, onPress }: CollapsibleTriggerProps) {
  return (
    <Pressable onPress={onPress} className={className}>
      {typeof children === 'string' ? (
        <Text className="text-sm text-foreground">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  )
}
CollapsibleTrigger.displayName = 'CollapsibleTrigger'

interface CollapsibleContentProps {
  className?: string
  children?: React.ReactNode
}

function CollapsibleContent({ className, children }: CollapsibleContentProps) {
  return <View className={cn('overflow-hidden', className)}>{children}</View>
}
CollapsibleContent.displayName = 'CollapsibleContent'

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
export type { CollapsibleProps, CollapsibleTriggerProps, CollapsibleContentProps }
