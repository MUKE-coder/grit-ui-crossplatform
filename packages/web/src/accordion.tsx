import * as React from 'react'
import { cn } from '@grit-ui/core'

/** Context for sharing accordion state. */
interface AccordionContextValue {
  type: 'single' | 'multiple'
  openItems: string[]
  toggle: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

function useAccordionContext() {
  const ctx = React.useContext(AccordionContext)
  if (!ctx) throw new Error('Accordion compound components must be used within <Accordion>')
  return ctx
}

/** Props for the Accordion component. */
export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether only one item can be open at a time. */
  type?: 'single' | 'multiple'
  /** Controlled open item(s). String for single, string[] for multiple. */
  value?: string | string[]
  /** Default open item(s). */
  defaultValue?: string | string[]
  /** Called when open items change. */
  onValueChange?: (value: string | string[]) => void
}

/**
 * Accordion with single or multiple open items and smooth height animation.
 *
 * @example
 * ```tsx
 * <Accordion type="single" defaultValue="item-1">
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Is it accessible?</AccordionTrigger>
 *     <AccordionContent>Yes, it follows WAI-ARIA patterns.</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, type = 'single', value, defaultValue, onValueChange, ...props }, ref) => {
    const normalizeValue = (v?: string | string[]): string[] => {
      if (!v) return []
      return Array.isArray(v) ? v : [v]
    }

    const [internalOpen, setInternalOpen] = React.useState<string[]>(normalizeValue(defaultValue))
    const openItems = value !== undefined ? normalizeValue(value) : internalOpen

    const toggle = React.useCallback(
      (itemValue: string) => {
        let next: string[]
        if (type === 'single') {
          next = openItems.includes(itemValue) ? [] : [itemValue]
        } else {
          next = openItems.includes(itemValue)
            ? openItems.filter((v) => v !== itemValue)
            : [...openItems, itemValue]
        }
        if (value === undefined) setInternalOpen(next)
        onValueChange?.(type === 'single' ? (next[0] || '') : next)
      },
      [type, openItems, value, onValueChange]
    )

    return (
      <AccordionContext.Provider value={{ type, openItems, toggle }}>
        <div ref={ref} className={cn('w-full', className)} {...props} />
      </AccordionContext.Provider>
    )
  }
)
Accordion.displayName = 'Accordion'

/** Item context. */
const AccordionItemContext = React.createContext<string>('')

/** Props for AccordionItem. */
export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Unique value for this item. */
  value: string
}

/** Single accordion item container. */
const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, ...props }, ref) => (
    <AccordionItemContext.Provider value={value}>
      <div ref={ref} className={cn('border-b border-border', className)} {...props} />
    </AccordionItemContext.Provider>
  )
)
AccordionItem.displayName = 'AccordionItem'

/** Accordion trigger button. */
const AccordionTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const { openItems, toggle } = useAccordionContext()
    const itemValue = React.useContext(AccordionItemContext)
    const isOpen = openItems.includes(itemValue)

    return (
      <h3 className="flex">
        <button
          ref={ref}
          type="button"
          aria-expanded={isOpen}
          className={cn(
            'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
            className
          )}
          data-state={isOpen ? 'open' : 'closed'}
          onClick={() => toggle(itemValue)}
          {...props}
        >
          {children}
          <svg
            className="h-4 w-4 shrink-0 transition-transform duration-200"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </h3>
    )
  }
)
AccordionTrigger.displayName = 'AccordionTrigger'

/** Accordion content panel with smooth height animation. */
const AccordionContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { openItems } = useAccordionContext()
    const itemValue = React.useContext(AccordionItemContext)
    const isOpen = openItems.includes(itemValue)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const [height, setHeight] = React.useState<number | undefined>(0)

    React.useEffect(() => {
      if (contentRef.current) {
        setHeight(isOpen ? contentRef.current.scrollHeight : 0)
      }
    }, [isOpen])

    return (
      <div
        ref={ref}
        className="overflow-hidden transition-[height] duration-200 ease-in-out"
        style={{ height: height !== undefined ? height + 'px' : undefined }}
        {...props}
      >
        <div ref={contentRef} className={cn('pb-4 pt-0', className)}>
          {children}
        </div>
      </div>
    )
  }
)
AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
