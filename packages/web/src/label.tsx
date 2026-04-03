import * as React from 'react'
import { cn } from '@grit-ui/core'

/** Props for the Label component. */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Show a required asterisk indicator. */
  required?: boolean
}

/**
 * Form label component with optional required indicator.
 *
 * @example
 * ```tsx
 * <Label htmlFor="email" required>Email address</Label>
 * ```
 */
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}
    </label>
  )
)
Label.displayName = 'Label'

export { Label }
