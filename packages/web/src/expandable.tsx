import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Expandable variant definitions using CVA.
 */
const expandableVariants = cva('relative', {
  variants: {
    variant: {
      default: '',
      bordered: 'border border-border rounded-lg p-4',
      card: 'bg-card rounded-lg p-4 shadow-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

/** Props for the Expandable component. */
export interface ExpandableProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof expandableVariants> {
  /** Maximum height in pixels when collapsed. Default 150. */
  maxHeight?: number
  /** Whether content starts expanded. Default false. */
  defaultExpanded?: boolean
  /** Controlled expanded state. */
  expanded?: boolean
  /** Called when expanded state changes. */
  onExpandedChange?: (expanded: boolean) => void
  /** "Show more" button text. */
  moreText?: string
  /** "Show less" button text. */
  lessText?: string
  /** Show gradient fade overlay when collapsed. Default true. */
  showGradient?: boolean
  /** Gradient color (should match background). Default 'from-transparent to-background'. */
  gradientClassName?: string
  /** Custom trigger button className. */
  triggerClassName?: string
}

/**
 * Expandable content with "Show more" / "Show less" toggle.
 * Supports maxHeight, gradient fade when collapsed, and smooth transition.
 *
 * @example
 * ```tsx
 * <Expandable maxHeight={100}>
 *   <p>Long content that gets truncated with a gradient fade...</p>
 *   <p>More content here...</p>
 * </Expandable>
 *
 * <Expandable maxHeight={200} moreText="Read more" lessText="Read less" variant="bordered">
 *   <article>...</article>
 * </Expandable>
 * ```
 */
const Expandable = React.forwardRef<HTMLDivElement, ExpandableProps>(
  (
    {
      className,
      variant,
      maxHeight = 150,
      defaultExpanded = false,
      expanded: controlledExpanded,
      onExpandedChange,
      moreText = 'Show more',
      lessText = 'Show less',
      showGradient = true,
      gradientClassName = 'from-transparent to-background',
      triggerClassName,
      children,
      ...props
    },
    ref
  ) => {
    const [internalExpanded, setInternalExpanded] = React.useState(defaultExpanded)
    const [needsExpand, setNeedsExpand] = React.useState(false)
    const contentRef = React.useRef<HTMLDivElement>(null)

    const isExpanded = controlledExpanded ?? internalExpanded

    const toggle = () => {
      const next = !isExpanded
      if (controlledExpanded === undefined) {
        setInternalExpanded(next)
      }
      onExpandedChange?.(next)
    }

    // Check if content exceeds maxHeight
    React.useEffect(() => {
      if (!contentRef.current) return
      const check = () => {
        const scrollH = contentRef.current?.scrollHeight ?? 0
        setNeedsExpand(scrollH > maxHeight)
      }
      check()
      // Re-check on resize
      const observer = new ResizeObserver(check)
      observer.observe(contentRef.current)
      return () => observer.disconnect()
    }, [maxHeight, children])

    return (
      <div ref={ref} className={cn(expandableVariants({ variant }), className)} {...props}>
        <div
          ref={contentRef}
          className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
          style={{
            maxHeight: isExpanded ? contentRef.current?.scrollHeight + 'px' : maxHeight + 'px',
          }}
        >
          {children}
        </div>

        {/* Gradient overlay */}
        {!isExpanded && needsExpand && showGradient && (
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b pointer-events-none',
              gradientClassName
            )}
            style={{ bottom: needsExpand ? '32px' : '0' }}
            aria-hidden="true"
          />
        )}

        {/* Toggle button */}
        {needsExpand && (
          <button
            type="button"
            onClick={toggle}
            className={cn(
              'mt-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1',
              triggerClassName
            )}
          >
            {isExpanded ? lessText : moreText}
          </button>
        )}
      </div>
    )
  }
)
Expandable.displayName = 'Expandable'

export { Expandable, expandableVariants }
