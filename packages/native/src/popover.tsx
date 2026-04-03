import React, { createContext, useContext, useState, useRef, useCallback } from 'react'
import { View, Pressable, Modal, useWindowDimensions, type LayoutRectangle } from 'react-native'
import { cn } from '@grit-ui/core'

interface PopoverContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerLayout: LayoutRectangle | null
  setTriggerLayout: (layout: LayoutRectangle | null) => void
}

const PopoverContext = createContext<PopoverContextValue>({
  open: false,
  setOpen: () => {},
  triggerLayout: null,
  setTriggerLayout: () => {},
})

interface PopoverProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function Popover({ children, open: controlledOpen, onOpenChange }: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const [triggerLayout, setTriggerLayout] = useState<LayoutRectangle | null>(null)
  const isOpen = controlledOpen ?? uncontrolledOpen

  const setOpen = useCallback(
    (value: boolean) => {
      setUncontrolledOpen(value)
      onOpenChange?.(value)
    },
    [onOpenChange]
  )

  return (
    <PopoverContext.Provider value={{ open: isOpen, setOpen, triggerLayout, setTriggerLayout }}>
      {children}
    </PopoverContext.Provider>
  )
}

interface PopoverTriggerProps {
  className?: string
  children: React.ReactNode
}

function PopoverTrigger({ className, children }: PopoverTriggerProps) {
  const { setOpen, setTriggerLayout } = useContext(PopoverContext)
  const triggerRef = useRef<View>(null)

  const handlePress = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setTriggerLayout({ x, y, width, height })
      setOpen(true)
    })
  }

  return (
    <Pressable ref={triggerRef} onPress={handlePress} className={cn(className)}>
      {children}
    </Pressable>
  )
}

interface PopoverContentProps {
  className?: string
  children: React.ReactNode
  align?: 'start' | 'center' | 'end'
}

function PopoverContent({ className, children, align = 'center' }: PopoverContentProps) {
  const { open, setOpen, triggerLayout } = useContext(PopoverContext)
  const { width: windowWidth } = useWindowDimensions()

  const getLeft = () => {
    if (!triggerLayout) return 0
    if (align === 'start') return triggerLayout.x
    if (align === 'end') return triggerLayout.x + triggerLayout.width - 200
    return triggerLayout.x + triggerLayout.width / 2 - 100
  }

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
      <Pressable className="flex-1" onPress={() => setOpen(false)}>
        <View
          style={{
            position: 'absolute',
            top: triggerLayout ? triggerLayout.y + triggerLayout.height + 4 : 0,
            left: Math.max(8, Math.min(getLeft(), windowWidth - 208)),
          }}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              className={cn(
                'w-[200px] rounded-lg border border-border bg-background p-4 shadow-lg',
                className
              )}
            >
              {children}
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  )
}

export { Popover, PopoverTrigger, PopoverContent }
export type { PopoverProps, PopoverTriggerProps, PopoverContentProps }
