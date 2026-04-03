import * as React from 'react'
import { cn } from '@grit-ui/core'
import type { Side, Align } from '@grit-ui/core'

/* ---------------------------------- Context --------------------------------- */

interface HoverCardContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement>
}

const HoverCardContext = React.createContext<HoverCardContextValue | undefined>(undefined)

function useHoverCardContext() {
  const ctx = React.useContext(HoverCardContext)
  if (!ctx) throw new Error('HoverCard compound components must be used within <HoverCard>')
  return ctx
}

/* ---------------------------------- Root ----------------------------------- */

/** Props for the HoverCard root component. */
export interface HoverCardProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Delay before showing in ms. */
  openDelay?: number
  /** Delay before hiding in ms. */
  closeDelay?: number
  children: React.ReactNode
}

/**
 * Hover-triggered preview card for displaying rich content on hover.
 *
 * @example
 * ```tsx
 * <HoverCard>
 *   <HoverCardTrigger asChild><a href="/user">@username</a></HoverCardTrigger>
 *   <HoverCardContent>
 *     <p>User profile preview</p>
 *   </HoverCardContent>
 * </HoverCard>
 * ```
 */
function HoverCard({
  open: controlledOpen,
  onOpenChange,
  openDelay = 300,
  closeDelay = 200,
  children,
}: HoverCardProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const showTimer = React.useRef<ReturnType<typeof setTimeout>>()
  const hideTimer = React.useRef<ReturnType<typeof setTimeout>>()
  const triggerRef = React.useRef<HTMLElement>(null!)

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      clearTimeout(showTimer.current)
      clearTimeout(hideTimer.current)

      if (next) {
        showTimer.current = setTimeout(() => {
          if (!isControlled) setUncontrolledOpen(true)
          onOpenChange?.(true)
        }, openDelay)
      } else {
        hideTimer.current = setTimeout(() => {
          if (!isControlled) setUncontrolledOpen(false)
          onOpenChange?.(false)
        }, closeDelay)
      }
    },
    [isControlled, onOpenChange, openDelay, closeDelay]
  )

  React.useEffect(() => {
    return () => {
      clearTimeout(showTimer.current)
      clearTimeout(hideTimer.current)
    }
  }, [])

  return (
    <HoverCardContext.Provider value={{ open, onOpenChange: handleOpenChange, triggerRef }}>
      {children}
    </HoverCardContext.Provider>
  )
}
HoverCard.displayName = 'HoverCard'

/* --------------------------------- Trigger --------------------------------- */

export interface HoverCardTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean
}

const HoverCardTrigger = React.forwardRef<HTMLElement, HoverCardTriggerProps>(
  ({ asChild = false, children, ...props }, ref) => {
    const { onOpenChange, triggerRef } = useHoverCardContext()

    const mergedRef = React.useCallback(
      (node: HTMLElement | null) => {
        ;(triggerRef as React.MutableRefObject<HTMLElement | null>).current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node
      },
      [ref, triggerRef]
    )

    const handlers = {
      onMouseEnter: () => onOpenChange(true),
      onMouseLeave: () => onOpenChange(false),
    }

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, { ...handlers, ref: mergedRef })
    }

    return (
      <span ref={mergedRef as React.Ref<HTMLSpanElement>} {...handlers} {...props}>
        {children}
      </span>
    )
  }
)
HoverCardTrigger.displayName = 'HoverCardTrigger'

/* --------------------------------- Content --------------------------------- */

export interface HoverCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: Side
  align?: Align
  sideOffset?: number
}

/**
 * The hover card content panel.
 */
const HoverCardContent = React.forwardRef<HTMLDivElement, HoverCardContentProps>(
  ({ className, side = 'bottom', align = 'center', sideOffset = 4, children, ...props }, ref) => {
    const { open, onOpenChange, triggerRef } = useHoverCardContext()
    const contentRef = React.useRef<HTMLDivElement>(null)
    const [position, setPosition] = React.useState({ top: 0, left: 0 })

    React.useEffect(() => {
      if (!open || !triggerRef.current || !contentRef.current) return

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()

      let top = 0
      let left = 0

      switch (side) {
        case 'top':
          top = triggerRect.top - contentRect.height - sideOffset
          break
        case 'bottom':
          top = triggerRect.bottom + sideOffset
          break
        case 'left':
          left = triggerRect.left - contentRect.width - sideOffset
          top = triggerRect.top
          break
        case 'right':
          left = triggerRect.right + sideOffset
          top = triggerRect.top
          break
      }

      if (side === 'top' || side === 'bottom') {
        switch (align) {
          case 'start':
            left = triggerRect.left
            break
          case 'center':
            left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
            break
          case 'end':
            left = triggerRect.right - contentRect.width
            break
        }
      } else {
        switch (align) {
          case 'start':
            top = triggerRect.top
            break
          case 'center':
            top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2
            break
          case 'end':
            top = triggerRect.bottom - contentRect.height
            break
        }
      }

      setPosition({ top, left })
    }, [open, side, align, sideOffset, triggerRef])

    if (!open) return null

    const ReactDOM = require('react-dom') as typeof import('react-dom')
    return ReactDOM.createPortal(
      <div
        ref={(node) => {
          ;(contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        onMouseEnter={() => onOpenChange(true)}
        onMouseLeave={() => onOpenChange(false)}
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          zIndex: 50,
        }}
        className={cn(
          'z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95',
          className
        )}
        {...props}
      >
        {children}
      </div>,
      document.body
    )
  }
)
HoverCardContent.displayName = 'HoverCardContent'

export { HoverCard, HoverCardTrigger, HoverCardContent }
