import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Status indicator variant definitions.
 */
const statusVariants = cva('inline-flex items-center gap-2 text-sm font-medium', {
  variants: {
    variant: {
      success: 'text-emerald-600 dark:text-emerald-400',
      warning: 'text-amber-600 dark:text-amber-400',
      destructive: 'text-red-600 dark:text-red-400',
      info: 'text-blue-600 dark:text-blue-400',
      neutral: 'text-muted-foreground',
      processing: 'text-blue-600 dark:text-blue-400',
    },
  },
  defaultVariants: {
    variant: 'neutral',
  },
})

const dotVariants = cva('h-2 w-2 rounded-full', {
  variants: {
    variant: {
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      destructive: 'bg-red-500',
      info: 'bg-blue-500',
      neutral: 'bg-muted-foreground',
      processing: 'bg-blue-500 animate-pulse',
    },
  },
  defaultVariants: {
    variant: 'neutral',
  },
})

/** Props for the Status component. */
export interface StatusProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusVariants> {
  /** Label text displayed next to the dot. */
  label?: string
  /** Size of the dot in pixels. */
  dotSize?: number
  /** Hide the dot and show only the label. */
  hideDot?: boolean
}

/**
 * Status indicator with colored dot and label.
 *
 * @example
 * ```tsx
 * <Status variant="success" label="Active" />
 * <Status variant="processing" label="Loading..." />
 * <Status variant="destructive" label="Error" />
 * ```
 */
const Status = React.forwardRef<HTMLSpanElement, StatusProps>(
  ({ className, variant, label, dotSize, hideDot = false, children, ...props }, ref) => (
    <span ref={ref} className={cn(statusVariants({ variant }), className)} {...props}>
      {!hideDot && (
        <span
          className={cn(dotVariants({ variant }))}
          style={dotSize ? { width: dotSize, height: dotSize } : undefined}
        />
      )}
      {label ?? children}
    </span>
  )
)
Status.displayName = 'Status'

export { Status, statusVariants, dotVariants }
