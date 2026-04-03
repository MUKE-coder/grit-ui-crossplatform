import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Callout variant definitions.
 * 3 variants: info, warning, danger — each with distinct colors and icons.
 */
const calloutVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        info: 'border-blue-500/50 bg-blue-50 text-blue-900 [&>svg]:text-blue-600 dark:bg-blue-950/50 dark:text-blue-100 dark:border-blue-500/30 dark:[&>svg]:text-blue-400',
        warning: 'border-amber-500/50 bg-amber-50 text-amber-900 [&>svg]:text-amber-600 dark:bg-amber-950/50 dark:text-amber-100 dark:border-amber-500/30 dark:[&>svg]:text-amber-400',
        danger: 'border-red-500/50 bg-red-50 text-red-900 [&>svg]:text-red-600 dark:bg-red-950/50 dark:text-red-100 dark:border-red-500/30 dark:[&>svg]:text-red-400',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
)

/** SVG icons for each callout variant. */
const calloutIcons: Record<string, React.ReactNode> = {
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  ),
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ),
  danger: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  ),
}

/** Props for the Callout component. */
export interface CalloutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutVariants> {
  /** Optional title displayed above the content. */
  title?: string
  /** Override the default icon for the variant. */
  icon?: React.ReactNode
}

/**
 * Documentation callout block with info, warning, and danger variants.
 *
 * @example
 * ```tsx
 * <Callout variant="info" title="Note">
 *   This is an informational callout.
 * </Callout>
 * <Callout variant="danger" title="Error">
 *   Something went wrong.
 * </Callout>
 * ```
 */
const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, variant = 'info', title, icon, children, ...props }, ref) => {
    const resolvedIcon = icon ?? calloutIcons[variant ?? 'info']

    return (
      <div ref={ref} role="alert" className={cn(calloutVariants({ variant }), className)} {...props}>
        {resolvedIcon}
        <div>
          {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
          <div className="text-sm [&_p]:leading-relaxed">{children}</div>
        </div>
      </div>
    )
  }
)
Callout.displayName = 'Callout'

export { Callout, calloutVariants }
