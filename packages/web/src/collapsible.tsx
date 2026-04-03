import * as React from 'react'
import { cn } from '@grit-ui/core'

/** Context for sharing collapsible state. */
interface CollapsibleContextValue {
  open: boolean
  toggle: () => void
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null)

function useCollapsibleContext() {
  const ctx = React.useContext(CollapsibleContext)
  if (!ctx) throw new Error('Collapsible compound components must be used within <Collapsible>')
  return ctx
}

/** Props for the Collapsible component. */
export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled open state. */
  open?: boolean
  /** Default open state (uncontrolled). */
  defaultOpen?: boolean
  /** Called when open state changes. */
  onOpenChange?: (open: boolean) => void
}

/**
 * Simple show/hide toggle with compound component pattern.
 *
 * @example
 * ```tsx
 * <Collapsible>
 *   <CollapsibleTrigger>Toggle</CollapsibleTrigger>
 *   <CollapsibleContent>Hidden content here</CollapsibleContent>
 * </Collapsible>
 * ```
 */
const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ className, open: controlledOpen, defaultOpen = false, onOpenChange, ...props }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

    const toggle = React.useCallback(() => {
      const next = !isOpen
      if (controlledOpen === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    }, [isOpen, controlledOpen, onOpenChange])

    return (
      <CollapsibleContext.Provider value={{ open: isOpen, toggle }}>
        <div ref={ref} className={cn('w-full', className)} {...props} />
      </CollapsibleContext.Provider>
    )
  }
)
Collapsible.displayName = 'Collapsible'

/** Trigger button for the collapsible. */
const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { toggle } = useCollapsibleContext()

    return (
      <button
        ref={ref}
        type="button"
        className={cn('flex items-center', className)}
        onClick={toggle}
        {...props}
      />
    )
  }
)
CollapsibleTrigger.displayName = 'CollapsibleTrigger'

/** Content revealed when the collapsible is open. */
const CollapsibleContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { open } = useCollapsibleContext()
    const contentRef = React.useRef<HTMLDivElement>(null)
    const [height, setHeight] = React.useState<number>(0)

    React.useEffect(() => {
      if (contentRef.current) {
        setHeight(open ? contentRef.current.scrollHeight : 0)
      }
    }, [open])

    return (
      <div
        ref={ref}
        className={cn('overflow-hidden transition-[height] duration-200 ease-in-out', className)}
        style={{ height: height + 'px' }}
        {...props}
      >
        <div ref={contentRef}>{children}</div>
      </div>
    )
  }
)
CollapsibleContent.displayName = 'CollapsibleContent'

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
