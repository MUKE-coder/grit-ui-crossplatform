import * as React from 'react'
import { cn } from '@grit-ui/core'

/** Props for the Checkbox component. */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Whether the checkbox is in an indeterminate state. */
  indeterminate?: boolean
  /** Label text rendered next to the checkbox. */
  label?: string
}

/**
 * Checkbox input with support for checked, indeterminate, and disabled states.
 * Uses a custom visual checkmark rendered via CSS.
 *
 * @example
 * ```tsx
 * <Checkbox label="Accept terms" />
 * <Checkbox indeterminate />
 * ```
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate = false, label, id, ...props }, ref) => {
    const innerRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => innerRef.current!)

    React.useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate
      }
    }, [indeterminate])

    const checkboxId = id || React.useId()

    return (
      <div className="flex items-center gap-2">
        <div className="relative flex items-center">
          <input
            ref={innerRef}
            id={checkboxId}
            type="checkbox"
            className={cn(
              'peer h-4 w-4 shrink-0 rounded border border-input bg-background ring-offset-background',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'checked:bg-primary checked:border-primary checked:text-primary-foreground',
              'appearance-none cursor-pointer',
              className
            )}
            {...props}
          />
          {/* Checkmark icon */}
          <svg
            className="pointer-events-none absolute left-0 top-0 h-4 w-4 text-primary-foreground opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-100"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {indeterminate ? (
              <line x1="5" y1="12" x2="19" y2="12" />
            ) : (
              <polyline points="20 6 9 17 4 12" />
            )}
          </svg>
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
