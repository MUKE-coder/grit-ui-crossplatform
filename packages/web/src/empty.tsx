import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/* -------------------------------- Variants --------------------------------- */

const emptyVariants = cva(
  'flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center',
  {
    variants: {
      variant: {
        'no-data': '',
        'no-results': '',
        error: 'border-destructive/50',
        'no-content': '',
        'no-notifications': '',
        'no-messages': '',
        'no-files': '',
        'no-users': '',
        'no-projects': '',
        'no-tasks': '',
      },
    },
    defaultVariants: {
      variant: 'no-data',
    },
  }
)

/** Default icons for each variant. */
const emptyIcons: Record<string, React.ReactNode> = {
  'no-data': (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  'no-results': (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-destructive/50">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  ),
  'no-content': (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  'no-notifications': (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  ),
  'no-messages': (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  'no-files': (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  'no-users': (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  'no-projects': (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  ),
  'no-tasks': (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
}

/** Default titles for each variant. */
const emptyTitles: Record<string, string> = {
  'no-data': 'No data',
  'no-results': 'No results found',
  error: 'Something went wrong',
  'no-content': 'No content yet',
  'no-notifications': 'No notifications',
  'no-messages': 'No messages',
  'no-files': 'No files',
  'no-users': 'No users',
  'no-projects': 'No projects',
  'no-tasks': 'No tasks',
}

/* ---------------------------------- Props ---------------------------------- */

/** Props for the Empty component. */
export interface EmptyProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyVariants> {
  /** Title text. Auto-generated from variant if not provided. */
  title?: string
  /** Description text. */
  description?: string
  /** Override the default icon. */
  icon?: React.ReactNode
  /** Action button or element. */
  action?: React.ReactNode
}

/**
 * Empty state component with icon, title, description, and optional action.
 *
 * @example
 * ```tsx
 * <Empty variant="no-results" description="Try adjusting your filters." />
 * <Empty variant="error" action={<Button onClick={retry}>Retry</Button>} />
 * ```
 */
const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  ({ className, variant = 'no-data', title, description, icon, action, ...props }, ref) => {
    const resolvedVariant = variant ?? 'no-data'
    const resolvedIcon = icon ?? emptyIcons[resolvedVariant]
    const resolvedTitle = title ?? emptyTitles[resolvedVariant]

    return (
      <div ref={ref} className={cn(emptyVariants({ variant }), className)} {...props}>
        {resolvedIcon && <div className="mb-4">{resolvedIcon}</div>}
        {resolvedTitle && <h3 className="text-lg font-semibold">{resolvedTitle}</h3>}
        {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
        {action && <div className="mt-4">{action}</div>}
      </div>
    )
  }
)
Empty.displayName = 'Empty'

export { Empty, emptyVariants }
