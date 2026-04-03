import * as React from 'react'
import { cn } from '@grit-ui/core'
import type { Side, Align } from '@grit-ui/core'

/* ---------------------------------- Context --------------------------------- */

interface PopoverContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement>
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(undefined)

function usePopoverContext() {
  const ctx = React.useContext(PopoverContext)
  if (!ctx) throw new Error('Popover compound components must be used within <Popover>')
  return ctx
}

/* ---------------------------------- Root ----------------------------------- */

/** Props for the Popover root component. */
export interface PopoverProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  children: React.ReactNode
}

/**
 * Click-triggered floating panel for forms, menus, or additional content.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverTrigger asChild><Button>Options</Button></PopoverTrigger>
 *   <PopoverContent side="bottom" align="start">
 *     <p>Popover content</p>
 *   </PopoverContent>
 * </Popover>
 * ```
 */
function Popover({ open: controlledOpen, onOpenChange, defaultOpen = false, children }: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const triggerRef = React.useRef<HTMLElement>(null!)

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange]
  )

  return (
    <PopoverContext.Provider value={{ open, onOpenChange: handleOpenChange, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  )
}
Popover.displayName = 'Popover'

/* --------------------------------- Trigger --------------------------------- */

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ asChild = false, onClick, children, ...props }, ref) => {
    const { open, onOpenChange, triggerRef } = usePopoverContext()

    const mergedRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        ;(triggerRef as React.MutableRefObject<HTMLElement | null>).current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
      },
      [ref, triggerRef]
    )

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)
      onOpenChange(!open)
    }

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        onClick: handleClick,
        ref: mergedRef,
      })
    }

    return (
      <button ref={mergedRef} type="button" onClick={handleClick} {...props}>
        {children}
      </button>
    )
  }
)
PopoverTrigger.displayName = 'PopoverTrigger'

/* --------------------------------- Content --------------------------------- */

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: Side
  align?: Align
  sideOffset?: number
}

/**
 * The popover content panel. Positioned relative to the trigger.
 */
const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, side = 'bottom', align = 'center', sideOffset = 4, children, ...props }, ref) => {
    const { open, onOpenChange, triggerRef } = usePopoverContext()
    const contentRef = React.useRef<HTMLDivElement>(null)
    const [position, setPosition] = React.useState({ top: 0, left: 0 })

    // Position calculation
    React.useEffect(() => {
      if (!open || !triggerRef.current || !contentRef.current) return

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()

      let top = 0
      let left = 0

      // Side positioning
      switch (side) {
        case 'top':
          top = triggerRect.top - contentRect.height - sideOffset
          left = triggerRect.left
          break
        case 'bottom':
          top = triggerRect.bottom + sideOffset
          left = triggerRect.left
          break
        case 'left':
          top = triggerRect.top
          left = triggerRect.left - contentRect.width - sideOffset
          break
        case 'right':
          top = triggerRect.top
          left = triggerRect.right + sideOffset
          break
      }

      // Alignment
      if (side === 'top' || side === 'bottom') {
        switch (align) {
          case 'start':
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

    // Click outside to close
    React.useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(e.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node)
        ) {
          onOpenChange(false)
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [open, onOpenChange, triggerRef])

    // Escape to close
    React.useEffect(() => {
      if (!open) return
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onOpenChange(false)
      }
      document.addEventListener('keydown', handler)
      return () => document.removeEventListener('keydown', handler)
    }, [open, onOpenChange])

    if (!open) return null

    const ReactDOM = require('react-dom') as typeof import('react-dom')
    return ReactDOM.createPortal(
      <div
        ref={(node) => {
          ;(contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          zIndex: 50,
        }}
        className={cn(
          'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95',
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
PopoverContent.displayName = 'PopoverContent'

export { Popover, PopoverTrigger, PopoverContent }
