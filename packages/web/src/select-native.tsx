import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * SelectNative variant definitions.
 */
const selectNativeVariants = cva(
  'flex w-full appearance-none rounded-md border border-input bg-background text-sm ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-10 px-3 py-2 pr-8',
        sm: 'h-9 px-2 py-1 pr-7 text-xs',
        lg: 'h-11 px-4 py-3 pr-9',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

/** Props for the SelectNative component. */
export interface SelectNativeProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectNativeVariants> {
  /** Placeholder displayed when no option is selected. */
  placeholder?: string
}

/**
 * Native HTML select element styled to match the design system.
 *
 * @example
 * ```tsx
 * <SelectNative placeholder="Select a fruit">
 *   <option value="apple">Apple</option>
 *   <option value="banana">Banana</option>
 *   <option value="cherry">Cherry</option>
 * </SelectNative>
 * ```
 */
const SelectNative = React.forwardRef<HTMLSelectElement, SelectNativeProps>(
  ({ className, size, placeholder, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(selectNativeVariants({ size }), className)}
        defaultValue={props.defaultValue ?? (placeholder ? '' : undefined)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      {/* Chevron icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  )
)
SelectNative.displayName = 'SelectNative'

export { SelectNative, selectNativeVariants }
