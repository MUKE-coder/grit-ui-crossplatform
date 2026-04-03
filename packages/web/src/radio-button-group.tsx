import * as React from 'react'
import { cn } from '@grit-ui/core'
import type { Orientation } from '@grit-ui/core'

/* ---------------------------------- Context --------------------------------- */

interface RadioGroupContextValue {
  value: string
  onValueChange: (value: string) => void
  name: string
  disabled: boolean
  orientation: Orientation
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | undefined>(undefined)

function useRadioGroupContext() {
  const ctx = React.useContext(RadioGroupContext)
  if (!ctx) throw new Error('RadioGroupItem must be used within <RadioGroup>')
  return ctx
}

/* ---------------------------------- Root ----------------------------------- */

/** Props for the RadioGroup component. */
export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current selected value. */
  value?: string
  /** Default value for uncontrolled usage. */
  defaultValue?: string
  /** Callback when selection changes. */
  onValueChange?: (value: string) => void
  /** Orientation of the radio buttons. */
  orientation?: Orientation
  /** Name attribute for the radio inputs. */
  name?: string
  /** Disable all radio items. */
  disabled?: boolean
}

/**
 * Grouped radio buttons with horizontal or vertical layout.
 *
 * @example
 * ```tsx
 * <RadioGroup value={plan} onValueChange={setPlan} orientation="vertical">
 *   <RadioGroupItem value="free" label="Free" />
 *   <RadioGroupItem value="pro" label="Pro" />
 *   <RadioGroupItem value="enterprise" label="Enterprise" />
 * </RadioGroup>
 * ```
 */
const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue = '',
      onValueChange,
      orientation = 'vertical',
      name: nameProp,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : uncontrolledValue
    const generatedName = React.useId()
    const name = nameProp ?? generatedName

    const handleValueChange = React.useCallback(
      (next: string) => {
        if (!isControlled) setUncontrolledValue(next)
        onValueChange?.(next)
      },
      [isControlled, onValueChange]
    )

    return (
      <RadioGroupContext.Provider value={{ value, onValueChange: handleValueChange, name, disabled, orientation }}>
        <div
          ref={ref}
          role="radiogroup"
          aria-orientation={orientation}
          className={cn(
            'grid gap-2',
            orientation === 'horizontal' ? 'grid-flow-col auto-cols-max' : 'grid-flow-row',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    )
  }
)
RadioGroup.displayName = 'RadioGroup'

/* ---------------------------------- Item ----------------------------------- */

/** Props for RadioGroupItem. */
export interface RadioGroupItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** Value of this radio option. */
  value: string
  /** Label text displayed next to the radio button. */
  label?: string
}

/**
 * Individual radio button within a RadioGroup.
 */
const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, label, disabled: itemDisabled, id: idProp, ...props }, ref) => {
    const ctx = useRadioGroupContext()
    const generatedId = React.useId()
    const id = idProp ?? generatedId
    const isChecked = ctx.value === value
    const isDisabled = itemDisabled ?? ctx.disabled

    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <input
          ref={ref}
          type="radio"
          id={id}
          name={ctx.name}
          value={value}
          checked={isChecked}
          disabled={isDisabled}
          onChange={() => ctx.onValueChange(value)}
          className="sr-only peer"
          {...props}
        />
        <div
          onClick={() => !isDisabled && ctx.onValueChange(value)}
          className={cn(
            'flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border border-primary ring-offset-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
            isDisabled && 'cursor-not-allowed opacity-50',
            isChecked && 'border-primary'
          )}
        >
          {isChecked && (
            <div className="h-2.5 w-2.5 rounded-full bg-current" />
          )}
        </div>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              'text-sm font-medium leading-none',
              isDisabled && 'cursor-not-allowed opacity-70'
            )}
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)
RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }
