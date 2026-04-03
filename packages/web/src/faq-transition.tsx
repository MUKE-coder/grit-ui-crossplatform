import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * FAQTransition variant definitions using CVA.
 */
const faqTransitionVariants = cva('divide-y divide-border', {
  variants: {
    variant: {
      default: '',
      bordered: 'border border-border rounded-lg overflow-hidden',
      separated: 'space-y-2 divide-y-0 [&>*]:border [&>*]:border-border [&>*]:rounded-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

/** Context for FAQ state management. */
interface FAQContextValue {
  openItems: Set<string>
  toggle: (id: string) => void
  allowMultiple: boolean
}

const FAQContext = React.createContext<FAQContextValue | null>(null)

function useFAQ() {
  const ctx = React.useContext(FAQContext)
  if (!ctx) throw new Error('FAQ components must be used within <FAQTransition>')
  return ctx
}

/** Item context to pass the id down. */
const FAQItemContext = React.createContext<string>('')

/** Props for FAQTransition. */
export interface FAQTransitionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof faqTransitionVariants> {
  /** Allow multiple items open at once. Default false. */
  allowMultiple?: boolean
  /** Default open item IDs. */
  defaultOpen?: string[]
}

/**
 * FAQ accordion with smooth height transition.
 *
 * @example
 * ```tsx
 * <FAQTransition>
 *   <FAQItem value="q1">
 *     <FAQTrigger>What is Grit?</FAQTrigger>
 *     <FAQContent>A full-stack scaffolding framework.</FAQContent>
 *   </FAQItem>
 *   <FAQItem value="q2">
 *     <FAQTrigger>Is it free?</FAQTrigger>
 *     <FAQContent>Yes, it is open source.</FAQContent>
 *   </FAQItem>
 * </FAQTransition>
 * ```
 */
const FAQTransition = React.forwardRef<HTMLDivElement, FAQTransitionProps>(
  ({ className, variant, allowMultiple = false, defaultOpen = [], children, ...props }, ref) => {
    const [openItems, setOpenItems] = React.useState<Set<string>>(new Set(defaultOpen))

    const toggle = React.useCallback(
      (id: string) => {
        setOpenItems((prev) => {
          const next = new Set(prev)
          if (next.has(id)) {
            next.delete(id)
          } else {
            if (!allowMultiple) next.clear()
            next.add(id)
          }
          return next
        })
      },
      [allowMultiple]
    )

    return (
      <FAQContext.Provider value={{ openItems, toggle, allowMultiple }}>
        <div ref={ref} className={cn(faqTransitionVariants({ variant }), className)} {...props}>
          {children}
        </div>
      </FAQContext.Provider>
    )
  }
)
FAQTransition.displayName = 'FAQTransition'

/** Props for FAQItem. */
export interface FAQItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Unique identifier for this item. */
  value: string
}

/**
 * Single FAQ item container.
 */
const FAQItem = React.forwardRef<HTMLDivElement, FAQItemProps>(
  ({ className, value, ...props }, ref) => (
    <FAQItemContext.Provider value={value}>
      <div ref={ref} className={cn('', className)} data-state={useFAQ().openItems.has(value) ? 'open' : 'closed'} {...props} />
    </FAQItemContext.Provider>
  )
)
FAQItem.displayName = 'FAQItem'

/**
 * FAQ question / trigger button.
 */
const FAQTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const { openItems, toggle } = useFAQ()
    const itemId = React.useContext(FAQItemContext)
    const isOpen = openItems.has(itemId)

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => toggle(itemId)}
        className={cn(
          'flex w-full items-center justify-between py-4 px-4 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent/50',
          className
        )}
        aria-expanded={isOpen}
        {...props}
      >
        <span>{children}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn('shrink-0 ml-2 transition-transform duration-200', isOpen && 'rotate-180')}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    )
  }
)
FAQTrigger.displayName = 'FAQTrigger'

/**
 * FAQ answer / collapsible content with smooth height transition.
 */
const FAQContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { openItems } = useFAQ()
    const itemId = React.useContext(FAQItemContext)
    const isOpen = openItems.has(itemId)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const [height, setHeight] = React.useState<number | undefined>(isOpen ? undefined : 0)

    React.useEffect(() => {
      if (!contentRef.current) return
      if (isOpen) {
        const h = contentRef.current.scrollHeight
        setHeight(h)
        // After transition, set to auto for dynamic content
        const timer = setTimeout(() => setHeight(undefined), 200)
        return () => clearTimeout(timer)
      } else {
        // Set explicit height first so transition works
        const h = contentRef.current.scrollHeight
        setHeight(h)
        // Force reflow then collapse
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setHeight(0)
          })
        })
      }
    }, [isOpen])

    return (
      <div
        ref={ref}
        className={cn('overflow-hidden transition-[height] duration-200 ease-in-out', className)}
        style={{ height: height === undefined ? 'auto' : height + 'px' }}
        aria-hidden={!isOpen}
        {...props}
      >
        <div ref={contentRef} className="px-4 pb-4 text-sm text-muted-foreground">
          {children}
        </div>
      </div>
    )
  }
)
FAQContent.displayName = 'FAQContent'

export { FAQTransition, faqTransitionVariants, FAQItem, FAQTrigger, FAQContent }
