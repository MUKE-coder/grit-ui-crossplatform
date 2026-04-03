import * as React from 'react'
import { cn } from '@grit-ui/core'
import type { Side, Align } from '@grit-ui/core'

/* ---------------------------------- Context --------------------------------- */

interface TooltipContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement>
}

const TooltipContext = React.createContext<TooltipContextValue | undefined>(undefined)

function useTooltipContext() {
  const ctx = React.useContext(TooltipContext)
  if (!ctx) throw new Error('Tooltip compound components must be used within <Tooltip>')
  return ctx
}

/* ---------------------------------- Root ----------------------------------- */

/** Props for the Tooltip root component. */
export interface TooltipProps {
  /** Controlled open state. */
  open?: boolean
  /** Callback when open state changes. */
  onOpenChange?: (open: boolean) => void
  /** Delay before showing (ms). */
  delayDuration?: number
  /** Delay before hiding (ms). */
  hideDelayDuration?: number
  children: React.ReactNode
}

/**
 * Hover tooltip for displaying additional information.
 *
 * @example
 * ```tsx
 * <Tooltip>
 *   <TooltipTrigger asChild><Button variant="icon">?</Button></TooltipTrigger>
 *   <TooltipContent side="top">Helpful info</TooltipContent>
 * </Tooltip>
 * ```
 */
function Tooltip({
  open: controlledOpen,
  onOpenChange,
  delayDuration = 400,
  hideDelayDuration = 0,
  children,
}: TooltipProps) {
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
        }, delayDuration)
      } else {
        hideTimer.current = setTimeout(() => {
          if (!isControlled) setUncontrolledOpen(false)
          onOpenChange?.(false)
        }, hideDelayDuration)
      }
    },
    [isControlled, onOpenChange, delayDuration, hideDelayDuration]
  )

  React.useEffect(() => {
    return () => {
      clearTimeout(showTimer.current)
      clearTimeout(hideTimer.current)
    }
  }, [])

  return (
    <TooltipContext.Provider value={{ open, onOpenChange: handleOpenChange, triggerRef }}>
      {children}
    </TooltipContext.Provider>
  )
}
Tooltip.displayName = 'Tooltip'

/* --------------------------------- Trigger --------------------------------- */

/** Props for TooltipTrigger. */
export interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean
}

/**
 * The element that triggers the tooltip on hover/focus.
 */
const TooltipTrigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(
  ({ asChild = false, children, ...props }, ref) => {
    const { onOpenChange, triggerRef } = useTooltipContext()

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
      onFocus: () => onOpenChange(true),
      onBlur: () => onOpenChange(false),
    }

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ...handlers,
        ref: mergedRef,
      })
    }

    return (
      <span ref={mergedRef as React.Ref<HTMLSpanElement>} tabIndex={0} {...handlers} {...props}>
        {children}
      </span>
    )
  }
)
TooltipTrigger.displayName = 'TooltipTrigger'

/* --------------------------------- Content --------------------------------- */

const sideOffsets: Record<Side, { top: string; left: string; transform: string }> = {
  top: { top: '-8px', left: '50%', transform: 'translate(-50%, -100%)' },
  bottom: { top: 'calc(100% + 8px)', left: '50%', transform: 'translate(-50%, 0)' },
  left: { top: '50%', left: '-8px', transform: 'translate(-100%, -50%)' },
  right: { top: '50%', left: 'calc(100% + 8px)', transform: 'translate(0, -50%)' },
}

/** Props for TooltipContent. */
export interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which side to show the tooltip. */
  side?: Side
  /** Alignment along the side axis. */
  align?: Align
  /** Offset from the trigger in pixels. */
  sideOffset?: number
}

/**
 * The tooltip content panel.
 */
const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, side = 'top', sideOffset = 8, children, ...props }, ref) => {
    const { open, triggerRef } = useTooltipContext()
    const [position, setPosition] = React.useState({ top: 0, left: 0 })
    const contentRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (!open || !triggerRef.current || !contentRef.current) return

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()

      let top = 0
      let left = 0

      switch (side) {
        case 'top':
          top = triggerRect.top - contentRect.height - sideOffset
          left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
          break
        case 'bottom':
          top = triggerRect.bottom + sideOffset
          left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
          break
        case 'left':
          top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2
          left = triggerRect.left - contentRect.width - sideOffset
          break
        case 'right':
          top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2
          left = triggerRect.right + sideOffset
          break
      }

      setPosition({ top, left })
    }, [open, side, sideOffset, triggerRef])

    if (!open) return null

    const ReactDOM = require('react-dom') as typeof import('react-dom')
    return ReactDOM.createPortal(
      <div
        ref={(node) => {
          ;(contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        role="tooltip"
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          zIndex: 50,
        }}
        className={cn(
          'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
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
TooltipContent.displayName = 'TooltipContent'

export { Tooltip, TooltipTrigger, TooltipContent }
