import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/* ---------------------------------- Context --------------------------------- */

interface ToggleGroupContextValue {
  type: 'single' | 'multiple'
  value: string[]
  onValueChange: (value: string[]) => void
  variant: 'default' | 'outline' | 'ghost'
  size: 'default' | 'sm' | 'lg'
  disabled: boolean
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | undefined>(undefined)

function useToggleGroupContext() {
  const ctx = React.useContext(ToggleGroupContext)
  if (!ctx) throw new Error('ToggleGroupItem must be used within <ToggleGroup>')
  return ctx
}

/* -------------------------------- Variants --------------------------------- */

const toggleGroupItemVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-transparent hover:bg-muted hover:text-muted-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-9 px-2.5 text-xs',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

/* ---------------------------------- Root ----------------------------------- */

/** Props for ToggleGroup. */
export interface ToggleGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Single or multiple selection mode. */
  type?: 'single' | 'multiple'
  /** Current value(s). For single mode, pass a single-element array or string. */
  value?: string | string[]
  /** Default value for uncontrolled usage. */
  defaultValue?: string | string[]
  /** Callback when value changes. */
  onValueChange?: (value: string[]) => void
  /** Visual variant for all items. */
  variant?: 'default' | 'outline' | 'ghost'
  /** Size for all items. */
  size?: 'default' | 'sm' | 'lg'
  /** Disable all items. */
  disabled?: boolean
}

/**
 * Grouped toggle buttons supporting single or multiple selection.
 *
 * @example
 * ```tsx
 * <ToggleGroup type="single" value={view} onValueChange={(v) => setView(v[0])}>
 *   <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
 *   <ToggleGroupItem value="list">List</ToggleGroupItem>
 * </ToggleGroup>
 * ```
 */
const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      className,
      type = 'single',
      value: controlledValue,
      defaultValue,
      onValueChange,
      variant = 'default',
      size = 'default',
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const normalizeValue = (v: string | string[] | undefined): string[] => {
      if (v === undefined) return []
      return Array.isArray(v) ? v : [v]
    }

    const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(
      () => normalizeValue(defaultValue)
    )
    const isControlled = controlledValue !== undefined
    const value = isControlled ? normalizeValue(controlledValue) : uncontrolledValue

    const handleValueChange = React.useCallback(
      (next: string[]) => {
        if (!isControlled) setUncontrolledValue(next)
        onValueChange?.(next)
      },
      [isControlled, onValueChange]
    )

    return (
      <ToggleGroupContext.Provider value={{ type, value, onValueChange: handleValueChange, variant, size, disabled }}>
        <div
          ref={ref}
          role="group"
          className={cn('inline-flex items-center justify-center gap-1 rounded-md', className)}
          {...props}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    )
  }
)
ToggleGroup.displayName = 'ToggleGroup'

/* ---------------------------------- Item ----------------------------------- */

/** Props for ToggleGroupItem. */
export interface ToggleGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The value this item represents. */
  value: string
}

/**
 * Individual toggle button within a ToggleGroup.
 */
const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, value, disabled: itemDisabled, children, ...props }, ref) => {
    const ctx = useToggleGroupContext()
    const isPressed = ctx.value.includes(value)
    const isDisabled = itemDisabled ?? ctx.disabled

    const handleClick = () => {
      if (isDisabled) return

      if (ctx.type === 'single') {
        ctx.onValueChange(isPressed ? [] : [value])
      } else {
        if (isPressed) {
          ctx.onValueChange(ctx.value.filter((v) => v !== value))
        } else {
          ctx.onValueChange([...ctx.value, value])
        }
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-pressed={isPressed}
        data-state={isPressed ? 'on' : 'off'}
        disabled={isDisabled}
        onClick={handleClick}
        className={cn(
          toggleGroupItemVariants({ variant: ctx.variant, size: ctx.size }),
          'rounded-md',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
ToggleGroupItem.displayName = 'ToggleGroupItem'

export { ToggleGroup, ToggleGroupItem, toggleGroupItemVariants }
