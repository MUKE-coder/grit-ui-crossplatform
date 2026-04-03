import * as React from 'react'
import { cn } from '@grit-ui/core'

/** Props for the Switch component. */
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text rendered next to the switch. */
  label?: string
}

/**
 * Toggle switch with smooth transition animation.
 * Supports controlled (checked/onChange) and uncontrolled (defaultChecked) usage.
 *
 * @example
 * ```tsx
 * <Switch label="Dark mode" checked={dark} onChange={e => setDark(e.target.checked)} />
 * ```
 */
const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, disabled, ...props }, ref) => {
    const switchId = id || React.useId()

    return (
      <div className="flex items-center gap-2">
        <label
          htmlFor={switchId}
          className={cn(
            'group relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
            'has-[:checked]:bg-primary has-[:not(:checked)]:bg-input',
            'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background',
            disabled && 'cursor-not-allowed opacity-50',
            className
          )}
        >
          <input
            ref={ref}
            id={switchId}
            type="checkbox"
            role="switch"
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <span
            className={cn(
              'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
              'peer-checked:translate-x-5 peer-not-checked:translate-x-0'
            )}
          />
        </label>
        {label && (
          <label
            htmlFor={switchId}
            className={cn(
              'text-sm font-medium leading-none cursor-pointer',
              disabled && 'cursor-not-allowed opacity-70'
            )}
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)
Switch.displayName = 'Switch'

export { Switch }
