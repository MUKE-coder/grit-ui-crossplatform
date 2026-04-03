import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Spinner variant definitions using CVA.
 * Supports 3 animation styles and 4 sizes.
 */
const spinnerVariants = cva('inline-flex items-center justify-center', {
  variants: {
    variant: {
      spin: '',
      dots: '',
      pulse: '',
    },
    size: {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
  },
  defaultVariants: {
    variant: 'spin',
    size: 'md',
  },
})

/** Props for the Spinner component. */
export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  /** Accessible label for screen readers. */
  label?: string
}

/**
 * Loading spinner with multiple animation variants.
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner variant="dots" size="lg" />
 * <Spinner variant="pulse" size="sm" />
 * ```
 */
const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, variant = 'spin', size, label = 'Loading', ...props }, ref) => {
    if (variant === 'dots') {
      return (
        <div
          ref={ref}
          role="status"
          aria-label={label}
          className={cn(spinnerVariants({ variant, size }), 'gap-1', className)}
          {...props}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="inline-block h-1.5 w-1.5 rounded-full bg-current animate-bounce"
              style={{ animationDelay: i * 150 + 'ms' }}
            />
          ))}
          <span className="sr-only">{label}</span>
        </div>
      )
    }

    if (variant === 'pulse') {
      return (
        <div
          ref={ref}
          role="status"
          aria-label={label}
          className={cn(spinnerVariants({ variant, size }), className)}
          {...props}
        >
          <span className="inline-block h-full w-full rounded-full bg-current animate-pulse opacity-75" />
          <span className="sr-only">{label}</span>
        </div>
      )
    }

    // Default: spin
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cn(spinnerVariants({ variant, size }), className)}
        {...props}
      >
        <svg className="h-full w-full animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="sr-only">{label}</span>
      </div>
    )
  }
)
Spinner.displayName = 'Spinner'

export { Spinner, spinnerVariants }
