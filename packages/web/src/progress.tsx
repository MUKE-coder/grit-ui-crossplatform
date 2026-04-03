import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Progress bar color variants.
 */
const progressVariants = cva('h-full rounded-full transition-all duration-300 ease-in-out', {
  variants: {
    color: {
      default: 'bg-primary',
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      destructive: 'bg-destructive',
    },
  },
  defaultVariants: {
    color: 'default',
  },
})

/** Props for the Progress component. */
export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  /** Progress value from 0 to 100. */
  value?: number
  /** Show indeterminate animation (ignores value). */
  indeterminate?: boolean
  /** Optional label displayed above the bar. */
  label?: string
  /** Show the percentage text. */
  showValue?: boolean
}

/**
 * Progress bar with determinate and indeterminate states.
 *
 * @example
 * ```tsx
 * <Progress value={60} label="Uploading..." showValue />
 * <Progress indeterminate color="success" />
 * ```
 */
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, color, value = 0, indeterminate = false, label, showValue = false, ...props }, ref) => {
    const clampedValue = Math.max(0, Math.min(100, value))

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {(label || showValue) && (
          <div className="mb-1 flex items-center justify-between text-sm">
            {label && <span className="font-medium text-foreground">{label}</span>}
            {showValue && !indeterminate && (
              <span className="text-muted-foreground">{Math.round(clampedValue)}%</span>
            )}
          </div>
        )}
        <div
          className="relative h-2 w-full overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {indeterminate ? (
            <div
              className={cn(
                progressVariants({ color }),
                'w-1/3 animate-[indeterminate_1.5s_ease-in-out_infinite] absolute'
              )}
              style={{
                animation: 'indeterminate 1.5s ease-in-out infinite',
              }}
            />
          ) : (
            <div
              className={cn(progressVariants({ color }))}
              style={{ width: clampedValue + '%' }}
            />
          )}
        </div>
      </div>
    )
  }
)
Progress.displayName = 'Progress'

export { Progress, progressVariants }
