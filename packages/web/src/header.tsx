import * as React from 'react'
import { cn } from '@grit-ui/core'

/** Props for the Header component. */
export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Page title. */
  title: string
  /** Optional description below the title. */
  description?: string
  /** Actions slot rendered on the right side. */
  actions?: React.ReactNode
}

/**
 * Page header with title, description, and actions slot.
 *
 * @example
 * ```tsx
 * <Header
 *   title="Dashboard"
 *   description="Overview of your account"
 *   actions={<Button>New Project</Button>}
 * />
 * ```
 */
const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
  ({ className, title, description, actions, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between', className)}
      {...props}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 mt-2 sm:mt-0">{actions}</div>}
    </div>
  )
)
Header.displayName = 'Header'

export { Header }
