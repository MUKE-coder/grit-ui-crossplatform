import React, { createContext, useContext, useState, useRef } from 'react'
import { View, Pressable, Modal, type LayoutRectangle } from 'react-native'
import { cn } from '@grit-ui/core'

interface HoverCardContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerLayout: LayoutRectangle | null
  setTriggerLayout: (layout: LayoutRectangle | null) => void
}

const HoverCardContext = createContext<HoverCardContextValue>({
  open: false,
  setOpen: () => {},
  triggerLayout: null,
  setTriggerLayout: () => {},
})

interface HoverCardProps {
  children: React.ReactNode
}

function HoverCard({ children }: HoverCardProps) {
  const [open, setOpen] = useState(false)
  const [triggerLayout, setTriggerLayout] = useState<LayoutRectangle | null>(null)

  return (
    <HoverCardContext.Provider value={{ open, setOpen, triggerLayout, setTriggerLayout }}>
      {children}
    </HoverCardContext.Provider>
  )
}

interface HoverCardTriggerProps {
  className?: string
  children: React.ReactNode
}

function HoverCardTrigger({ className, children }: HoverCardTriggerProps) {
  const { setOpen, setTriggerLayout } = useContext(HoverCardContext)
  const ref = useRef<View>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleLongPress = () => {
    ref.current?.measureInWindow((x, y, width, height) => {
      setTriggerLayout({ x, y, width, height })
      setOpen(true)
    })
  }

  return (
    <Pressable
      ref={ref}
      onLongPress={handleLongPress}
      delayLongPress={500}
      className={cn(className)}
    >
      {children}
    </Pressable>
  )
}

interface HoverCardContentProps {
  className?: string
  children: React.ReactNode
}

function HoverCardContent({ className, children }: HoverCardContentProps) {
  const { open, setOpen, triggerLayout } = useContext(HoverCardContext)

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
      <Pressable className="flex-1" onPress={() => setOpen(false)}>
        <View
          style={{
            position: 'absolute',
            top: triggerLayout ? triggerLayout.y + triggerLayout.height + 4 : 0,
            left: triggerLayout ? triggerLayout.x : 0,
          }}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              className={cn(
                'w-64 rounded-lg border border-border bg-background p-4 shadow-lg',
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

export { HoverCard, HoverCardTrigger, HoverCardContent }
export type { HoverCardProps, HoverCardTriggerProps, HoverCardContentProps }
