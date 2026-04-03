import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Chip variant definitions matching badge variants.
 */
const chipVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground border-border',
        success: 'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
        warning: 'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

/** Props for the Chip component. */
export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  /** Show a dismiss button. */
  dismissible?: boolean
  /** Called when the dismiss button is clicked. */
  onDismiss?: () => void
  /** Icon rendered before the label. */
  icon?: React.ReactNode
}

/**
 * Tag/chip component with dismiss button and icon support.
 *
 * @example
 * ```tsx
 * <Chip variant="default">React</Chip>
 * <Chip variant="success" dismissible onDismiss={() => {}}>Active</Chip>
 * <Chip icon={<StarIcon />}>Featured</Chip>
 * ```
 */
const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, variant, dismissible, onDismiss, icon, children, ...props }, ref) => (
    <div ref={ref} className={cn(chipVariants({ variant }), className)} {...props}>
      {icon && <span className="[&_svg]:size-3">{icon}</span>}
      <span>{children}</span>
      {dismissible && (
        <button
          type="button"
          className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onDismiss?.()
          }}
          aria-label="Dismiss"
        >
          <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  )
)
Chip.displayName = 'Chip'

export { Chip, chipVariants }
