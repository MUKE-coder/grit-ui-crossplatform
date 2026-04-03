import * as React from 'react'
import { cn } from '@grit-ui/core'

/** Props for the RadioButton component. */
export interface RadioButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text rendered next to the radio button. */
  label?: string
}

/**
 * Single radio button with a custom dot indicator.
 *
 * @example
 * ```tsx
 * <RadioButton name="plan" value="free" label="Free plan" />
 * <RadioButton name="plan" value="pro" label="Pro plan" />
 * ```
 */
const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ className, label, id, ...props }, ref) => {
    const radioId = id || React.useId()

    return (
      <div className="flex items-center gap-2">
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            id={radioId}
            type="radio"
            className={cn(
              'peer h-4 w-4 shrink-0 rounded-full border border-input bg-background ring-offset-background',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'checked:border-primary',
              'appearance-none cursor-pointer',
              className
            )}
            {...props}
          />
          {/* Custom dot */}
          <div className="pointer-events-none absolute h-2 w-2 rounded-full bg-primary opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
        {label && (
          <label
            htmlFor={radioId}
            className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)
RadioButton.displayName = 'RadioButton'

export { RadioButton }
